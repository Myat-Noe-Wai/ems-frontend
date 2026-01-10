import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

const LeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const response = await api.get('/leave-requests');
      setLeaveRequests(response.data);
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

  return (
    <div>
      <h2 className="text-center" style={{ marginTop: "10px" }}>
        Leave Requests
      </h2>

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
              <td>{request.employeeName}</td>
              <td>{request.leaveType}</td>
              <td>{new Date(request.startDate).toLocaleDateString()}</td>
              <td>{new Date(request.endDate).toLocaleDateString()}</td>
              <td>{request.reason}</td>
              <td>{request.status}</td>
              <td>
                {request.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(request.id)}
                      className="btn btn-success"
                      style={{ marginRight: "10px" }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="btn btn-danger"
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveRequests;
