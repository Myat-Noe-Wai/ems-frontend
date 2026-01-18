import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import moment from 'moment';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import autoTable from 'jspdf-autotable';

const AttendanceTrackingComponent = () => {
    const today = moment().format('YYYY-MM-DD');

    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [employeeId, setEmployeeId] = useState('');
    const [fromDate, setFromDate] = useState(today);
    const [toDate, setToDate] = useState(today);

    useEffect(() => {
        fetchEmployees();           // load employee dropdown
        fetchAttendanceRecords({
            fromDate: today,
            toDate: today
        });
    }, []);

    // 🔹 Fetch attendance (default = today)
    const fetchAttendanceRecords = async (params = {}) => {
        try {
            const response = await api.get('/attendance', { params });
            setAttendanceRecords(response.data);
        } catch (error) {
            console.error('Error fetching attendance records:', error);
        }
    };

    // 🔹 Fetch employee list for dropdown
    const fetchEmployees = async () => {
        try {
            const response = await api.get('/v1/employees');
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    // 🔹 Search button
    const handleSearch = () => {
        const params = {};

        if (employeeId) params.employeeId = employeeId;
        if (fromDate) params.fromDate = fromDate;
        if (toDate) params.toDate = toDate;

        fetchAttendanceRecords(params);
    };

    // 🔹 Reset filters
    const handleReset = () => {
        setEmployeeId('');
        setFromDate(today);
        setToDate(today);
        fetchAttendanceRecords({
            fromDate: today,
            toDate: today
        });
    };

    const formatDateTime = (dateTime) => {
        return dateTime
            ? moment(dateTime).format('YYYY-MM-DD HH:mm:ss')
            : '';
    };

    const calculateHours = (clockIn, clockOut) => {
        if (!clockIn || !clockOut) return '';
    
        const start = moment(clockIn);
        const end = moment(clockOut);
    
        const hours = moment.duration(end.diff(start)).asHours();
        return hours.toFixed(1);
    };

    // | Condition                                          | Status   |
    // | -------------------------------------------------- | -------- |
    // | No clockIn                                         | Absent   |
    // | clockIn exists & no clockOut **AND date is today** | Working  |
    // | clockIn exists & no clockOut **AND date < today**  | Absent   |
    // | clockIn + clockOut ≥ 8 hrs                         | Present  |
    // | clockIn + clockOut < 8 hrs                         | Half Day |
    const calculateStatus = (date, clockIn, clockOut) => {
        if (!clockIn) return 'Absent';

        const recordDate = moment(date, 'YYYY-MM-DD');
        const today = moment().startOf('day');

        // ⛔ Missed clock-out and day already passed
        if (clockIn && !clockOut && recordDate.isBefore(today)) {
            return 'Absent';
        }

        // ⏳ Still today → Working
        if (clockIn && !clockOut && recordDate.isSame(today)) {
            return 'Working';
        }

        const hours = calculateHours(clockIn, clockOut);

        if (hours >= 8) return 'Present';
        return 'Half Day';
    };
    
    const formatTime = (dateTime) => {
        if (!dateTime) return '-';
      
        const date = new Date(dateTime);
      
        return date.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: 'Asia/Yangon',
        });
    };

    const getExportData = () => {
        return attendanceRecords.map(record => ({
            employeeName: record.employeeName,
            date: record.date,
            timeIn: formatTime(record.clockIn),
            timeOut: record.clockOut ? formatTime(record.clockOut) : 'Not Clocked Out',
            hours: calculateHours(record.clockIn, record.clockOut),
            status: calculateStatus(record.date, record.clockIn, record.clockOut),
        }));
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
    
        doc.setFontSize(16);
        doc.text('Attendance Report', 14, 15);
    
        doc.setFontSize(10);
        doc.text(`From: ${fromDate}   To: ${toDate}`, 14, 22);
    
        const tableColumn = [
            'Employee Name',
            'Date',
            'Time In',
            'Time Out',
            'Hours',
            'Status',
        ];
    
        const tableRows = getExportData().map(item => [
            item.employeeName,
            item.date,
            item.timeIn,
            item.timeOut,
            item.hours,
            item.status,
        ]);
    
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 28,
            styles: { fontSize: 9 },
            headStyles: { fillColor: [13, 110, 253] },
        });
    
        doc.save(`attendance_${fromDate}_to_${toDate}.pdf`);
    };    

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(getExportData());
        const workbook = XLSX.utils.book_new();
    
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');
    
        const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
        });
    
        const data = new Blob([excelBuffer], {
            type:
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
    
        saveAs(data, `attendance_${fromDate}_to_${toDate}.xlsx`);
    };    

    return (
        <div>

            <h2 className="text-center mt-3 mb-3">
                Attendance Tracking
            </h2>

            {/* 🔹 Filters */}
            <div className="row mb-3">
                <div className="col-md-3">
                    <select
                        className="form-control"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                    >
                        <option value="">All Employees</option>
                        {employees.map(emp => (
                            <option key={emp.id} value={emp.id}>
                                {emp.firstName + " " + emp.lastName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-md-2">
                    <input
                        type="date"
                        className="form-control"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                </div>

                <div className="col-md-2">
                    <input
                        type="date"
                        className="form-control"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                    />
                </div>

                <div className="col-md-5 d-flex gap-2">
                    <button className="btn btn-primary mr-2" onClick={handleSearch}>
                        Search
                    </button>
                    <button className="btn btn-secondary mr-2" onClick={handleReset}>
                        Reset
                    </button>
                    <button className="btn btn-outline-success mr-2" onClick={exportToExcel} disabled={attendanceRecords.length === 0}>
                        Export Excel
                    </button>
                    <button className="btn btn-outline-danger" onClick={exportToPDF} disabled={attendanceRecords.length === 0}>
                        Export PDF
                    </button>
                </div>
            </div>

            {/* 🔹 Attendance Table */}
            <table className="table table-striped table-bordered table-hover">
                <thead className="table-primary">
                    <tr>
                        <th>Employee Name</th>
                        <th>Date</th>
                        <th>Time In</th>
                        <th>Time Out</th>
                        <th>Hours</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {attendanceRecords.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="text-center">
                                No attendance records found
                            </td>
                        </tr>
                    ) : (
                        attendanceRecords.map((record, index) => (
                            <tr key={index}>
                                <td>{record.employeeName}</td>
                                <td>{record.date}</td>
                                <td>{formatTime(record.clockIn)}</td>
                                <td>
                                    {record.clockOut
                                        ? formatTime(record.clockOut)
                                        : <span className="text-danger">Not Clocked Out</span>
                                    }
                                </td>
                                <td>
                                    {calculateHours(record.clockIn, record.clockOut)}
                                </td>
                                <td>
                                    <span
                                        className={
                                            calculateStatus(record.date, record.clockIn, record.clockOut) === 'Present'
                                                ? 'badge bg-success'
                                                : calculateStatus(record.date, record.clockIn, record.clockOut) === 'Half Day'
                                                    ? 'badge bg-warning text-dark'
                                                    : calculateStatus(record.date, record.clockIn, record.clockOut) === 'Working'
                                                        ? 'badge bg-info'
                                                        : 'badge bg-danger'
                                        }
                                    >
                                        {calculateStatus(record.date, record.clockIn, record.clockOut)}
                                    </span>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

        </div>
    );
};

export default AttendanceTrackingComponent;
