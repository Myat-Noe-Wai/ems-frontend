import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { useEffect } from 'react';
import moment from 'moment';

const EmployeeAttendance = () => {
  const [status, setStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [attendanceList, setAttendanceList] = useState([]);

  const userId = localStorage.getItem('id');
  const employeeName = localStorage.getItem('userName');
  console.log("User Id in Employee Attendance: ", userId);

  useEffect(() => {
    fetchAttendance();
  }, []);  

  const handleClockIn = async () => {
    try {
      // Store the response in 'res'
      const res = await api.post('/attendance/clock-in', {
        userId: Number(userId),
        employeeName: employeeName,
      });

      // Show backend message if exists, otherwise default success
      setStatus(res.data.message || 'Clock-in successful!');
      setShowModal(true);
      fetchAttendance();
    } catch (error) {
      console.error(error);
      setStatus('Failed to clock in.');
      setShowModal(true);
    }
  };

  const handleClockOut = async () => {
    try {
      const res = await api.put(`/attendance/clock-out/${userId}`);
      setStatus(res.data.message || 'Clock-out successful!');
      setShowModal(true);
      fetchAttendance();
    } catch (error) {
      console.error(error);
      setStatus('Failed to clock out.');
      setShowModal(true);
    }
  };

  const handleClose = () => setShowModal(false);

  const fetchAttendance = async () => {
    try {
      const res = await api.get(`/attendance/employee/${userId}`);
      setAttendanceList(res.data); // assuming backend returns a list of attendance objects
    } catch (error) {
      console.error(error);
    }
  };

  const formatTime = (dateTime) => {
    if (!dateTime) return '-';
  
    const date = new Date(dateTime);
  
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Yangon',
    });
  };

  const calculateHours = (clockIn, clockOut) => {
    if (!clockIn || !clockOut) return 0;

    const start = moment(clockIn);
    const end = moment(clockOut);

    return moment.duration(end.diff(start)).asHours(); // NUMBER
  };
  
  const calculateStatus = (date, clockIn, clockOut) => {
    if (!clockIn) return 'Absent';
  
    const recordDate = moment(date, 'YYYY-MM-DD');
    const today = moment().startOf('day');
  
    // ⛔ No clock-out & past date
    if (clockIn && !clockOut && recordDate.isBefore(today)) {
      return 'Absent';
    }
  
    // ⏳ Still working today
    if (clockIn && !clockOut && recordDate.isSame(today)) {
      return 'Working';
    }
  
    const hours = calculateHours(clockIn, clockOut);
    const late = isLateClockIn(clockIn);
  
    // 🚨 Late after 9AM
    if (late && hours >= 4) {
      return 'Half Day';
    }
  
    // ✅ On-time full day
    if (!late && hours >= 9) {
      return 'Present';
    }
  
    return 'Absent';
  };  

  const isLateClockIn = (clockIn) => {
    if (!clockIn) return false;
  
    const clockInTime = moment(clockIn);
    const nineAM = moment(
      clockInTime.format('YYYY-MM-DD') + ' 09:00',
      'YYYY-MM-DD HH:mm'
    );
  
    return clockInTime.isAfter(nineAM);
  };  

  return (
    <div className="mt-3">
      <div style={{ textAlign: "center" }}>
        <button className="btn btn-success mr-2" onClick={handleClockIn}>Time In</button>
        <button className="btn btn-success" onClick={handleClockOut}>Time Out</button>
      </div>

      <div className="mt-4">
        <h4 className="text-center">Attendance Records</h4>
        <table className="table table-bordered table-striped table-hover">
          <thead className="table-primary">
            <tr>
              <th>Employee Name</th>
              <th>Date</th>
              <th>Time In</th>
              <th>Time Out</th>
              <th>Hours</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceList.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">No records found</td>
              </tr>
            ) : (
              attendanceList.map((att) => (
                <tr key={att.id}>
                  <td>{employeeName}</td>
                  <td>{att.date}</td>
                  <td>
                    {att.clockIn ? (
                      <span className={isLateClockIn(att.clockIn) ? 'text-danger fw-bold' : ''}>
                        {formatTime(att.clockIn)}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    {att.clockOut
                      ? formatTime(att.clockOut)
                      : <span className="text-danger">Not Clocked Out</span>
                    }
                  </td>
                  <td>
                    {att.clockOut ? calculateHours(att.clockIn, att.clockOut).toFixed(1) : '-'}
                  </td>
                  <td>
                    <span
                      className={
                        calculateStatus(att.date, att.clockIn, att.clockOut) === 'Present'
                          ? 'badge bg-success'
                          : calculateStatus(att.date, att.clockIn, att.clockOut) === 'Half Day'
                            ? 'badge bg-warning text-dark'
                            : calculateStatus(att.date, att.clockIn, att.clockOut) === 'Working'
                              ? 'badge bg-info'
                              : 'badge bg-danger'
                      }
                    >
                      {calculateStatus(att.date, att.clockIn, att.clockOut)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <span style={closeStyle} onClick={handleClose}>&times;</span>
            <h4>Attendance Status</h4>
            <p>{status}</p>
            <button className="btn btn-secondary" onClick={handleClose}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Modal styling ---
const modalStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const modalContentStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '5px',
  width: '300px',
  textAlign: 'center',
  position: 'relative',
};

const closeStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  cursor: 'pointer',
};

export default EmployeeAttendance;
