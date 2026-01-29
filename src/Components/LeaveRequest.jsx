import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

const LeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [status, setStatus] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchLeaveRequests();
  }, [page, size]);

  const fetchLeaveRequests = async () => {
    try {
      const params = {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        status: status || undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        page,
        size,
      };
      const response = await api.get('/leave-requests', { params });
      setLeaveRequests(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/leave-requests/${id}/approve`);
      fetchLeaveRequests();
    } catch (error) {
      console.error('Error approving leave request:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/leave-requests/${id}/reject`);
      fetchLeaveRequests();
    } catch (error) {
      console.error('Error rejecting leave request:', error);
    }
  };

  const handleExport = async (type) => {
    try {
      const url = `/leave-requests/export/${type}`;
      const response = await api.get(url, { responseType: 'blob' });
      const blob = new Blob([response.data]);
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `leave_requests.${type === 'csv' ? 'csv' : 'xlsx'}`;
      link.click();
    } catch (error) {
      console.error('Error exporting leave requests:', error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="badge bg-warning">{status}</span>;
      case 'Approved':
        return <span className="badge bg-success">{status}</span>;
      case 'Rejected':
        return <span className="badge bg-danger">{status}</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  return (
    <div className="mt-3">
      {/* Filters */}
      <div className="row mb-3">
        <div className="col-md-2">
          <input type="text" placeholder="First Name" value={firstName}
            onChange={(e) => setFirstName(e.target.value)} className="form-control"/>
        </div>
        <div className="col-md-2">
          <input type="text" placeholder="Last Name" value={lastName}
              onChange={(e) => setLastName(e.target.value)} className="form-control"/>
        </div>
        <div className="col-md-2">
          <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div className="col-md-2">
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="form-control"/>
        </div>
        <div className="col-md-2">
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="form-control"/>
        </div>
        <div className="col-md-1">
          <button onClick={() => { setPage(0); fetchLeaveRequests(); }} className="btn btn-primary">
            Filter
          </button>
        </div>
        <div className="col-md-1">
          <button onClick={() => { setFirstName(''); setLastName(''); setStatus(''); setFromDate(''); setToDate(''); setPage(0); }} className="btn btn-secondary">
            Reset
          </button>
        </div>
      </div>
      <div className="row mb-3 ml-2">
        <div className="col-md-1.5 mr-2">
          <button onClick={() => handleExport('csv')} className="btn btn-outline-success">
            Export CSV
          </button>
        </div>
        <div className="col-md-1.5">
          <button onClick={() => handleExport('excel')} className="btn btn-outline-success">
            Export Excel
          </button>
        </div>
      </div>            

      {/* Table */}
      <table className="table table-striped table-bordered table-hover">
        <thead className="table-primary">
          <tr>
            <th>Employee Name</th>
            <th>Leave Type</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaveRequests.map((request) => (
            <tr key={request.id}>
              <td>{request.employee.firstName + " " + request.employee.lastName}</td>
              <td>{request.leaveType}</td>
              <td>{new Date(request.startDate).toLocaleDateString()}</td>
              <td>{new Date(request.endDate).toLocaleDateString()}</td>
              <td>{request.reason}</td>
              <td>{getStatusBadge(request.status)}</td>
              <td>
                {request.status === 'Pending' && (
                  <>
                    <button onClick={() => handleApprove(request.id)} className="btn btn-success me-2 mr-2">
                      Approve
                    </button>
                    <button onClick={() => handleReject(request.id)} className="btn btn-danger">
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <nav>
        <ul className="pagination">
          <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPage(page - 1)}>Previous</button>
          </li>
          {Array.from({ length: totalPages }).map((_, idx) => (
            <li key={idx} className={`page-item ${page === idx ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setPage(idx)}>{idx + 1}</button>
            </li>
          ))}
          <li className={`page-item ${page === totalPages - 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPage(page + 1)}>Next</button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default LeaveRequests;
