import React, { useState } from 'react';
import axios from 'axios';

const EmployeeAttendance = () => {
  const [status, setStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const employeeId = localStorage.getItem('id'); // Replace with actual employee ID
  const employeeName = localStorage.getItem('empName'); 
  //http://localhost:8080
  const handleClockIn = async () => {
    try {
      const response = await axios.post('https://employee-management-system-4oo9.onrender.com/api/attendance/clock-in', null, {
        params: {
          employeeId: employeeId,
          employeeName: employeeName,
        }
      });
      setStatus('Clock-in successful!');
      setShowModal(true);
    } catch (error) {
      console.error('Error clocking in:', error);
      setStatus('Failed to clock in.');
      setShowModal(true);
    }
  };
  //http://localhost:8080
  const handleClockOut = async () => {
    try {
      const response = await axios.post('https://employee-management-system-4oo9.onrender.com/api/attendance/clock-out', null, {
        params: {
          employeeId: employeeId,
        }
      });
      setStatus('Clock-out successful!');
      setShowModal(true);
    } catch (error) {
      console.error('Error clocking out:', error);
      setStatus('Failed to clock out.');
      setShowModal(true);
    }
  };

  const handleClose = () => setShowModal(false);

  return (
    <div>
      <h2 className="text-center" style={{ marginTop: "10px"}}>Employee Attendance</h2>
      <div style={{textAlign: "center"}} className={{marginTop: "10px", marginBottom: "15px"}}>
        <button className="btn btn-success" onClick={handleClockIn} style={{marginRight: "10px"}}>Time In</button>
        <button className="btn btn-success" onClick={handleClockOut}>Time Out</button>
      </div>
      {showModal && (
        <div className="modal" style={modalStyle}>
          <div className="modal-content" style={modalContentStyle}>
            <span className="close" style={closeStyle} onClick={handleClose}>&times;</span>
            <h4>Attendance Status</h4>
            <p>{status}</p>
            <button className="btn btn-secondary" onClick={handleClose}>Close</button>
          </div>
        </div>
      )}
      <div style={{height: "50px"}}>

      </div>
    </div>
  );
};

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
};

const closeStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  cursor: 'pointer',
};

export default EmployeeAttendance;
