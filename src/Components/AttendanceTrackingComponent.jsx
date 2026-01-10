import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import moment from 'moment';

const AttendanceTrackingComponent = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);

    useEffect(() => {
        fetchAttendanceRecords();
    }, []);

    const fetchAttendanceRecords = async () => {
        try {
            const response = await api.get('/attendance');
            setAttendanceRecords(response.data);
        } catch (error) {
            console.error('Error fetching attendance records:', error);
        }
    };

    const formatDateTime = (dateTime) => {
        return dateTime ? moment(dateTime).format('YYYY-MM-DD HH:mm:ss') : '';
    };

    return (
        <div>
            <h2 className="text-center" style={{ marginTop: "10px" }}>
                Attendance Tracking
            </h2>

            <table className="table table-striped table-bordered table-hover">
                <thead className="table-primary">
                    <tr>
                        <th>Employee Name</th>
                        <th>Date</th>
                        <th>Clock In</th>
                        <th>Clock Out</th>
                    </tr>
                </thead>
                <tbody>
                    {attendanceRecords.map((record, index) => (
                        <tr key={index}>
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