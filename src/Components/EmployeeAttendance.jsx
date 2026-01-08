import React, { useState } from 'react';
import api from '../api/axiosConfig';

const EmployeeAttendance = () => {
  const [status, setStatus] = useState('');
  const [showModal, setShowModal] = useState(false);

  const employeeId = localStorage.getItem('id');
  const employeeName = localStorage.getItem('userName');

  const handleClockIn = async () => {
    try {
      // Store the response in 'res'
      const res = await api.post('/attendance/clock-in', {
        employeeId: Number(employeeId),
        employeeName: employeeName,
      });

      // Show backend message if exists, otherwise default success
      setStatus(res.data.message || 'Clock-in successful!');
      setShowModal(true);
    } catch (error) {
      console.error(error);
      setStatus('Failed to clock in.');
      setShowModal(true);
    }
  };

  const handleClockOut = async () => {
    try {
      const res = await api.put(`/attendance/clock-out/${employeeId}`);
      setStatus(res.data.message || 'Clock-out successful!');
      setShowModal(true);
    } catch (error) {
      console.error(error);
      setStatus('Failed to clock out.');
      setShowModal(true);
    }
  };

  const handleClose = () => setShowModal(false);

  return (
    <div>
      <h2 className="text-center">Employee Attendance</h2>
      <div style={{ textAlign: "center" }}>
        <button className="btn btn-success" onClick={handleClockIn}>Time In</button>
        <button className="btn btn-success" onClick={handleClockOut}>Time Out</button>
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
