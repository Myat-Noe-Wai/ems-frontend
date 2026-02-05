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
  const [leaveHistory, setLeaveHistory] = useState([]);

  const [page, setPage] = useState(0);
  const [pageSize] = useState(4);
  const [totalPages, setTotalPages] = useState(0);

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchLeaveHistory(page);

    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [page, successMessage, errorMessage]);

  const fetchLeaveHistory = async (pageNumber = 0) => {
    try {
      const response = await api.get(
        `/leave-requests/my?page=${pageNumber}&size=${pageSize}`
      );

      setLeaveHistory(response.data?.content || []);
      setTotalPages(response.data?.totalPages || 0);
    } catch (error) {
      console.error('Error fetching leave history', error);
      setLeaveHistory([]);
    }
  };

  // ✅ FRONTEND VALIDATION
  const validateLeaveRequest = () => {
    if (!leaveType || !startDate || !endDate || !reason.trim()) {
      return 'Please fill all required fields';
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start > end) {
      return 'Start date cannot be after end date';
    }

    if (start < today) {
      return 'Leave start date cannot be in the past';
    }

    const diffDays = (end - start) / (1000 * 60 * 60 * 24) + 1;
    if (diffDays <= 0) {
      return 'Invalid leave duration';
    }

    return null; // ✅ valid
  };

  const handleLeaveApply = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    const validationError = validateLeaveRequest();
    if (validationError) {
      setErrorMessage(validationError);
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

      setSuccessMessage('Leave applied successfully ✅');
      fetchLeaveHistory(0);
      setPage(0);

      setLeaveType('');
      setStartDate('');
      setEndDate('');
      setReason('');
    } catch (error) {
      const backendMessage =
        error.response?.data?.message ||
        'Error applying for leave ❌';

      setErrorMessage(backendMessage);
      console.error('Error applying for leave', error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="badge bg-warning text-dark">{status}</span>;
      case 'Approved':
        return <span className="badge bg-success">{status}</span>;
      case 'Rejected':
        return <span className="badge bg-danger">{status}</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  return (
    <div className="container mt-3">
  
      {/* ================= APPLY LEAVE CARD ================= */}
      <div className="card shadow-sm mb-3">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">
            <i className="bi bi-calendar-plus mr-2"></i>
            Apply for Leave
          </h5>
        </div>
  
        <div className="card-body">
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
  
            <div className="col-md-3">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
  
            <div className="col-md-3">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
  
          <div className="mb-3">
            <label className="form-label">Reason</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Enter reason for leave..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
  
          <div className="text-end">
            <button onClick={handleLeaveApply} className="btn btn-success px-4">
              <i className="bi bi-send mr-2"></i>
              Apply Leave
            </button>
          </div>
  
          {/* Alerts */}
          {successMessage && (
            <div className="alert alert-success mt-3">
              {successMessage}
            </div>
          )}
  
          {errorMessage && (
            <div className="alert alert-danger mt-3">
              {errorMessage}
            </div>
          )}  
        </div>
      </div>
  
      {/* ================= LEAVE HISTORY CARD ================= */}
      <div className="card shadow-sm">
        <div className="card-header bg-light">
          <h5 className="mb-0">
            <i className="bi bi-clock-history mr-2"></i>
            Leave History
          </h5>
        </div>
  
        <div className="card-body p-0">
          <table className="table table-bordered table-hover table-striped mb-0">
            <thead className="table-secondary">
              <tr>
                <th>Leave Type</th>
                <th>Start</th>
                <th>End</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaveHistory.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-3">
                    No leave records found
                  </td>
                </tr>
              ) : (
                leaveHistory.map((leave) => (
                  <tr key={leave.id}>
                    <td>{leave.leaveType}</td>
                    <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                    <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                    <td>{leave.reason}</td>
                    <td>{getStatusBadge(leave.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
  
        {totalPages > 1 && (
          <div className="card-footer text-center">
            <button
              className="btn btn-outline-primary me-2"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              ← Prev
            </button>
  
            <span className="mx-2">
              Page {page + 1} of {totalPages}
            </span>
  
            <button
              className="btn btn-outline-primary ms-2"
              disabled={page === totalPages - 1}
              onClick={() => setPage(page + 1)}
            >
              Next →
            </button>
          </div>
        )}
      </div>
  
    </div>
  );  
};

export default EmployeeLeaveRequest;
