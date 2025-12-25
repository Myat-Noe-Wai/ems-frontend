// import React, { PureComponent } from 'react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { parseISO, format } from 'date-fns';
import moment from 'moment';

// function AttendanceTrackingComponent() {
const AttendanceTrackingComponent = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);

    useEffect(() => {
        fetchAttendanceRecords();
    }, []);

    const fetchAttendanceRecords = async () => {
        try {
        // const response = await axios.get('https://employee-management-system-4oo9.onrender.com/api/attendance');
        const response = await axios.get('http://localhost:8081/api/attendance');
        // const response = await axios.get('http://13.61.161.105/api/attendance');
        setAttendanceRecords(response.data);
        } catch (error) {
        console.error('Error fetching attendance records:', error);
        }
    };
    
    const formatDateTime = (dateTime) => {
        // const parsedDate = parseISO(dateTime);
        // return format(parsedDate, 'yyyy-MM-dd HH:mm:ss');
        return moment(dateTime).format('YYYY-MM-DD HH:mm:ss');
    };
        return (
            <div>
                <h2 className="text-center" style={{ marginTop: "10px"}}>Role Management</h2>
            
                <table className="table table-striped table-bordered">
                    <thead className="table-primary">
                        <tr>
                            <th>Employee Name</th>
                            <th>Date</th>
                            <th>Clock In</th>
                            <th>Clock Out</th>
                        </tr>
                    </thead>
                    <tbody>
                    {attendanceRecords.map(record => (
                        <tr>
                            <td>{record.employeeName}</td>
                            <td>{record.date}</td>
                            <td>{formatDateTime(record.clockIn)}</td>
                            <td>{formatDateTime(record.clockOut)}</td>                            
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
};

export default AttendanceTrackingComponent;