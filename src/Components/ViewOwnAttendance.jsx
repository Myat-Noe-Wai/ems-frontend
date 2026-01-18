import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import moment from 'moment';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ViewOwnAttendance = () => {
    const employeeId = localStorage.getItem('id');

    const [month, setMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    });

    const [records, setRecords] = useState([]);

    useEffect(() => {
        loadAttendance();
    }, [month]);

    const loadAttendance = async () => {
        try {
            const res = await api.get('/attendance/my/month', {
                params: { month, employeeId }
            });
            setRecords(res.data);
        } catch (error) {
            console.error('Failed to load attendance', error);
        }
    };

    const calculateHours = (clockIn, clockOut) => {
        if (!clockIn || !clockOut) return '';
        const start = moment(clockIn);
        const end = moment(clockOut);
        return moment.duration(end.diff(start)).asHours().toFixed(1);
    };

    const calculateStatus = (date, clockIn, clockOut) => {
        if (!clockIn) return 'Absent';
        const recordDate = moment(date, 'YYYY-MM-DD');
        const today = moment().startOf('day');

        if (clockIn && !clockOut && recordDate.isBefore(today)) return 'Absent';
        if (clockIn && !clockOut && recordDate.isSame(today)) return 'Working';

        return calculateHours(clockIn, clockOut) >= 8 ? 'Present' : 'Half Day';
    };

    const formatTime = (dateTime) => {
        if (!dateTime) return '-';
        return new Date(dateTime).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'Asia/Yangon',
        });
    };

    // Export helper
    const getExportData = () => {
        return records.map(r => ({
            Date: r.date,
            Day: new Date(r.date).toLocaleDateString('en-US', { weekday: 'short' }),
            'Time In': formatTime(r.clockIn),
            'Time Out': formatTime(r.clockOut),
            Hours: calculateHours(r.clockIn, r.clockOut),
            Status: calculateStatus(r.date, r.clockIn, r.clockOut)
        }));
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(getExportData());
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `attendance_${month}.xlsx`);
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('My Attendance Report', 14, 15);
        doc.setFontSize(10);
        doc.text(`Month: ${month}`, 14, 22);

        const tableColumn = ['Date', 'Day', 'Time In', 'Time Out', 'Hours', 'Status'];
        const tableRows = getExportData().map(item => [
            item.Date, item.Day, item['Time In'], item['Time Out'], item.Hours, item.Status
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 28,
            styles: { fontSize: 9 },
            headStyles: { fillColor: [13, 110, 253] }
        });

        doc.save(`attendance_${month}.pdf`);
    };

    const summary = records.reduce(
        (acc, r) => {
            const status = calculateStatus(r.date, r.clockIn, r.clockOut);
            const hours = Number(calculateHours(r.clockIn, r.clockOut)) || 0;

            if (status === 'Present') acc.present += 1;
            else if (status === 'Half Day') acc.halfDay += 1;
            else if (status === 'Absent') acc.absent += 1;
            else if (status === 'Working') acc.working += 1;

            acc.totalHours += hours;
            return acc;
        },
        { present: 0, halfDay: 0, absent: 0, working: 0, totalHours: 0 }
    );

    return (
        <div className="container mt-4">
            <h3>My Attendance</h3>

            {/* Month Selector + Export Buttons */}
            <div className="row mb-3 align-items-center">
                <div className="col-md-3">
                    <input
                        type="month"
                        className="form-control"
                        value={month}
                        onChange={e => setMonth(e.target.value)}
                    />
                </div>
                <div className="col-md-9 d-flex gap-2">
                    <button className="btn btn-outline-success mr-2" onClick={exportToExcel} disabled={records.length === 0}>
                        Export Excel
                    </button>
                    <button className="btn btn-outline-danger" onClick={exportToPDF} disabled={records.length === 0}>
                        Export PDF
                    </button>
                </div>
            </div>

            {/* Summary */}
            <div className="row mb-4">
                <div className="col-md-2"><strong>Present:</strong> {summary.present}</div>
                <div className="col-md-2"><strong>Half Day:</strong> {summary.halfDay}</div>
                <div className="col-md-2"><strong>Absent:</strong> {summary.absent}</div>
                <div className="col-md-2"><strong>Working:</strong> {summary.working}</div>
                <div className="col-md-4"><strong>Total Hours:</strong> {summary.totalHours.toFixed(1)}</div>
            </div>

            {/* Attendance Table */}
            <table className="table table-striped table-bordered table-hover">
                <thead className="table-primary">
                    <tr>
                        <th>Date</th>
                        <th>Day</th>
                        <th>Time In</th>
                        <th>Time Out</th>
                        <th>Hours</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {records.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="text-center">No records</td>
                        </tr>
                    ) : records.map(r => (
                        <tr key={r.id}>
                            <td>{r.date}</td>
                            <td>{new Date(r.date).toLocaleDateString('en-US', { weekday: 'short' })}</td>
                            <td>{formatTime(r.clockIn)}</td>
                            <td>{formatTime(r.clockOut)}</td>
                            <td>{calculateHours(r.clockIn, r.clockOut)}</td>
                            <td>
                                <span className={
                                    calculateStatus(r.date, r.clockIn, r.clockOut) === 'Present' ? 'badge bg-success'
                                    : calculateStatus(r.date, r.clockIn, r.clockOut) === 'Half Day' ? 'badge bg-warning text-dark'
                                    : calculateStatus(r.date, r.clockIn, r.clockOut) === 'Working' ? 'badge bg-info'
                                    : 'badge bg-danger'
                                }>
                                    {calculateStatus(r.date, r.clockIn, r.clockOut)}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ViewOwnAttendance;
