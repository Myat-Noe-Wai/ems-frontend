import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { useEffect } from 'react';
import moment from 'moment';

const EmployeeAttendance = () => {
  const [status, setStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [attendanceList, setAttendanceList] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(0);

  const userId = localStorage.getItem('id');
  const employeeName = localStorage.getItem('userName');
  console.log("User Id in Employee Attendance: ", userId);

  useEffect(() => {
    fetchAttendance(page);
  }, [page]);  

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

  const fetchAttendance = async (pageNumber = 0) => {
    try {
      const res = await api.get(
        `/attendance/employee/${userId}?page=${pageNumber}&size=${pageSize}`
      );
  
      setAttendanceList(res.data?.content || []); // ✅ SAFE
      setTotalPages(res.data?.totalPages || 0);
  
    } catch (error) {
      console.error(error);
      setAttendanceList([]); // fallback
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
  
  const calculateWeekTotal = (weekStartDate) => {
    return attendanceList
      .filter(att =>
        moment(att.date).startOf('week').format('YYYY-MM-DD') === weekStartDate &&
        att.clockIn &&
        att.clockOut
      )
      .reduce((sum, att) => {
        return sum + calculateHours(att.clockIn, att.clockOut);
      }, 0)
      .toFixed(1);
  };  

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        {/* ===== Card Header ===== */}
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Employee Attendance</h5>
          <small>Clock in / Clock out & daily records</small>
        </div>
  
        {/* ===== Card Body ===== */}
        <div className="card-body">
          {/* ===== Action Buttons ===== */}
          <div className="d-flex justify-content-center gap-3 mb-4">
            <button className="btn btn-success px-4 mr-2" onClick={handleClockIn}>
              <i className="bi bi-clock-history mr-2"></i>
              Time In
            </button>
  
            <button className="btn btn-danger px-4" onClick={handleClockOut}>
              <i className="bi bi-clock-history mr-2"></i>
              Time Out
            </button>
          </div>
  
          {/* ===== Attendance Table ===== */}
          <div className="table-responsive">
            <table className="table table-bordered table-hover table-striped align-middle text-center">              
              <tbody>
                {!attendanceList || attendanceList.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-muted text-center">
                      No records found
                    </td>
                  </tr>
                ) : (
                  (() => {
                    let lastWeek = null;

                    return attendanceList.map((att) => {
                      const currentWeek = moment(att.date)
                        .startOf('week')
                        .format('YYYY-MM-DD');

                      const isNewWeek = currentWeek !== lastWeek;
                      lastWeek = currentWeek;

                      return (
                        <React.Fragment key={att.id}>
                          {/* 🔵 Week Row */}
                          {isNewWeek && (
                            <>
                              <tr className="week-row fw-bold">
                                <td colSpan="3" className="text-start">
                                  Week of {currentWeek}
                                </td>
                                <td colSpan="3" className="text-end">
                                  Week total : {calculateWeekTotal(currentWeek)} hrs
                                </td>
                              </tr>

                              {/* 🔷 Header row per week */}
                              <tr className="column-header fw-semibold">
                                <td>Employee</td>
                                <td>Date</td>
                                <td>Time In</td>
                                <td>Time Out</td>
                                <td>Hours</td>
                                <td>Status</td>
                              </tr>
                            </>
                          )}

                          {/* 🧾 Attendance row */}
                          <tr>
                            <td className="fw-semibold">{employeeName}</td>
                            <td>{att.date}</td>

                            <td>
                              {att.clockIn ? (
                                <span
                                  className={
                                    isLateClockIn(att.clockIn)
                                      ? 'text-danger fw-bold'
                                      : ''
                                  }
                                >
                                  {formatTime(att.clockIn)}
                                </span>
                              ) : (
                                '-'
                              )}
                            </td>

                            <td>
                              {att.clockOut ? (
                                formatTime(att.clockOut)
                              ) : (
                                <span className="text-danger">Not Clocked Out</span>
                              )}
                            </td>

                            <td>
                              {att.clockOut
                                ? calculateHours(att.clockIn, att.clockOut).toFixed(1)
                                : '-'}
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
                        </React.Fragment>
                      );
                    });
                  })()
                )}
              </tbody>
            </table>
          </div>
  
          {/* ===== Pagination ===== */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
              <button
                className="btn btn-outline-primary"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                ⬅ Prev
              </button>
  
              <span className="fw-semibold">
                Page {page + 1} of {totalPages}
              </span>
  
              <button
                className="btn btn-outline-primary"
                disabled={page === totalPages - 1}
                onClick={() => setPage(page + 1)}
              >
                Next ➡
              </button>
            </div>
          )}
        </div>
      </div>
  
      {/* ===== Modal (unchanged) ===== */}
      {showModal && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <span style={closeStyle} onClick={handleClose}>
              &times;
            </span>
            <h5>Attendance Status</h5>
            <p>{status}</p>
            <button className="btn btn-secondary" onClick={handleClose}>
              Close
            </button>
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
