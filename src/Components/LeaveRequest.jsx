import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LeaveRequests = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);

  useEffect(() => {
    fetchLeaveRequests();
  }, []);
  //http://localhost:8080
  const fetchLeaveRequests = async () => {
    const response = await axios.get('https://employee-management-system-4oo9.onrender.com/api/leave-requests');
    setLeaveRequests(response.data);
  };

  const handleApprove = async (id) => {
    await axios.put(`https://employee-management-system-4oo9.onrender.com/api/leave-requests/${id}/approve`);
    fetchLeaveRequests();
  };

  const handleReject = async (id) => {
    await axios.put(`https://employee-management-system-4oo9.onrender.com/api/leave-requests/${id}/reject`);
    fetchLeaveRequests();
  };

  return (
    <div>
      <h2 className="text-center" style={{ marginTop: "10px"}}>Leave Requests</h2>
      <table className="table table-striped table-bordered">
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
              <td>{request.employee.firstName+ ' ' +request.employee.lastName}</td>
              <td>{request.leaveType}</td>
              <td>{new Date(request.startDate).toLocaleDateString()}</td>
              <td>{new Date(request.endDate).toLocaleDateString()}</td>
              <td>{request.reason}</td>
              <td>{request.status}</td>
              <td>
                {request.status === 'Pending' && (
                  <>
                    <button onClick={() => handleApprove(request.id)} className="btn btn-success" style={{marginRight: "10px"}}>Approve</button>
                    <button onClick={() => handleReject(request.id)} className="btn btn-danger" >Reject</button>
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
