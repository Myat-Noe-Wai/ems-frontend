// src/components/EmployeeLeaveRequest.js
import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const LEAVE_TYPES = [
  { value: '', label: 'Select Leave Type' },
  { value: 'ANNUAL', label: 'Annual Leave' },
  { value: 'SICK', label: 'Sick Leave' },
  { value: 'CASUAL', label: 'Casual Leave' },
  { value: 'UNPAID', label: 'Unpaid Leave' },
  { value: 'MATERNITY', label: 'Maternity Leave' },
  { value: 'PATERNITY', label: 'Paternity Leave' },
  { value: 'COMPASSIONATE', label: 'Compassionate Leave' }
];

const EmployeeLeaveRequest = () => {
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [leaveHistory, setLeaveHistory] = useState([]);

  const employeeId = Number(localStorage.getItem('id'));

  useEffect(() => {
    if (employeeId) {
      fetchLeaveHistory();
    }
  }, [employeeId]);

  const fetchLeaveHistory = async () => {
    try {
      const response = await api.get(`/leave-requests/my`);
      setLeaveHistory(response.data);
    } catch (error) {
      console.error('Error fetching leave history', error);
    }
  };

  const handleLeaveApply = async () => {
    if (!leaveType || !startDate || !endDate) {
      setMessage('Please fill all required fields');
      return;
    }

    const leaveRequest = {
      leaveType,
      startDate,
      endDate,
      reason
    };

    try {
      await api.post('/leave-requests/apply', leaveRequest);
      setMessage('Leave applied successfully');
      fetchLeaveHistory();
      setLeaveType('');
      setStartDate('');
      setEndDate('');
      setReason('');
    } catch (error) {
      setMessage('Error applying for leave');
      console.error('Error applying for leave', error);
    }
  };

  return (
    <div className="container">
      {/* Apply Leave */}
      <div>
        <h3 className="text-center">Apply for Leave</h3>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Leave Type</label>
            <select
              className="form-control"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
            >
              {LEAVE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Reason</label>
            <textarea
              className="form-control"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>

        <button onClick={handleLeaveApply} className="btn btn-success">
          Apply for Leave
        </button>

        {message && <p className="mt-2">{message}</p>}
      </div>

      {/* Leave History */}
      <div className="mt-4">
        <h3>Leave History</h3>
        <table className="table table-bordered table-striped table-hover">
          <thead className="table-primary">
            <tr>
              <th>Leave Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaveHistory.map((leave) => (
              <tr key={leave.id}>
                <td>{leave.leaveType}</td>
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
