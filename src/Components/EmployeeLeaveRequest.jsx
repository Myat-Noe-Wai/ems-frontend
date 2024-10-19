// src/components/EmployeeLeaveRequest.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeLeaveRequest = () => {
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [leaveHistory, setLeaveHistory] = useState([]);
  const employeeId = localStorage.getItem('id');
  console.log("empId ****");
  console.log(employeeId);

  // Fetch leave history for the logged-in employee
  useEffect(() => {
    fetchLeaveHistory(employeeId);
  }, []);
  
  const fetchLeaveHistory = async (employeeId) => {
    try {
      const response = await axios.get(`https://employee-management-system-4oo9.onrender.com/api/leave-requests/employee/${employeeId}`);
      // const response = await axios.get(`http://localhost:8080/api/leave-requests/employee/${employeeId}`);
      console.log("response");
      console.log(response);
      setLeaveHistory(response.data);
    } catch (error) {
      console.error('Error fetching leave history', error);
    }
  };

  const handleLeaveApply = async () => {
    const leaveRequest = {
      leaveType,
      startDate,
      endDate,
      reason,
      employee: {
        id: employeeId
     }
    };
    console.log("leaveRequest");
    console.log(leaveRequest);
    
    try {
      const response = await axios.post('https://employee-management-system-4oo9.onrender.com/api/leave-requests/apply', leaveRequest);
      // const response = await axios.post('http://localhost:8080/api/leave-requests/apply', leaveRequest);
      setMessage('Leave applied successfully');
      fetchLeaveHistory(); // Refresh history after successful application
    } catch (error) {
      setMessage('Error applying for leave');
      console.error('Error applying for leave', error);
    }
  };

  return (
    <div className='container'>
      <div>
        <h3 style={{textAlign: "center"}}>Apply for Leave</h3>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ flex: '1', marginRight: '10px' }}>
            <label className="form-label">Leave Type:</label>
            <input
              type="text"
              style={{ width: "100%" }}
              className="form-control"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
            />
          </div>

          <div style={{ flex: '1', marginLeft: '10px' }}>
            <label className="form-label">Start Date:</label>
            <input
              type="date"
              style={{ width: "100%" }}
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ flex: '1', marginRight: '10px' }}>
            <label className="form-label">End Date:</label>
            <input
              type="date"
              style={{ width: "100%" }}
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div style={{ flex: '1', marginLeft: '10px' }}>
            <label className="form-label">Reason:</label>
            <textarea
              style={{ width: "100%" }}
              className="form-control"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>

        <button onClick={handleLeaveApply} className="btn btn-success">
          Apply for Leave
        </button>
        <p>{message}</p>
      </div>

      <div>
        <h3>Leave History</h3>        
        <table class="table table-striped table-hover" style={{width: "100%"}}>
          <thead className="table-primary">
            <tr>
              <th scope="col">Leave Type</th>
              <th scope="col">Start Date</th>
              <th scope="col">End Date</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {leaveHistory.map((leave) => (
              <tr>
                <td scope="row">{leave.leaveType}</td>
                <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                <td>{leave.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeLeaveRequest;
