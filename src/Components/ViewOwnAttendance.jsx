import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import moment from 'moment';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ViewOwnAttendance = () => {
    const userId = localStorage.getItem('id');

    const [month, setMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    });

    const [records, setRecords] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize] = useState(7);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        loadAttendance(page);
    }, [month, page]);

    const loadAttendance = async (pageNumber = 0) => {
        try {
            const res = await api.get('/attendance/my/month', {
                params: { month, userId, page: pageNumber, size: pageSize }
            });

            setRecords(res.data?.content || []);
            setTotalPages(res.data?.totalPages || 0);
        } catch (error) {
            console.error('Failed to load attendance', error);
            setRecords([]);
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
        <div className="container my-2">
          <div className="card shadow-sm border-0">
            <div className="card-body">
    
                {/* Top Bar */}
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                    {/* Month picker */}
                    <input type="month" className="form-control month-input" value={month}
                        onChange={e => setMonth(e.target.value)}/>

                    {/* Export buttons */}
                    <div className="d-flex gap-2">
                        <button className="btn btn-outline-success mr-2" disabled={!records.length} onClick={exportToExcel}>
                            <i className="bi bi-file-earmark-excel me-1"></i> Export Excel
                        </button>
                        <button className="btn btn-outline-danger" disabled={!records.length} onClick={exportToPDF}>
                            <i className="bi bi-file-earmark-pdf me-1"></i> Export PDF
                        </button>
                    </div>

                    {/* Total hours card */}
                    <div className="total-hours-box">
                    <i className="bi bi-clock-history"></i>
                    <span>Total Hours:</span>
                    <strong>{summary.totalHours.toFixed(1)}</strong>
                    </div>
                </div>          
    
              {/* Summary Cards */}
              <div className="row g-3 mb-4">
                <SummaryCard title="Present" value={summary.present} color="success" icon="check-lg" />
                <SummaryCard title="Absent" value={summary.halfDay} color="danger" icon="x-lg" />
                <SummaryCard title="Half Day" value={summary.absent} color="warning" icon="clock" />
                <SummaryCard title="Working" value={summary.totalHours.toFixed(1)} color="primary" icon="briefcase" />
              </div>
    
              {/* Table */}
              <div className="table-responsive">
                <table className="table align-middle table-hover table-bordered">
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
                      <tr><td colSpan="6" className="text-center">No records</td></tr>
                    ) : records.map(r => {
                      const status = calculateStatus(r.date, r.clockIn, r.clockOut);
                      return (
                        <tr key={r.id}>
                          <td>{r.date}</td>
                          <td>{moment(r.date).format('ddd')}</td>
                          <td>{formatTime(r.clockIn)}</td>
                          <td>{formatTime(r.clockOut)}</td>
                          <td>{calculateHours(r.clockIn, r.clockOut)}</td>
                          <td>
                            <span className={`badge bg-${
                              status === 'Present' ? 'success'
                              : status === 'Half Day' ? 'warning text-dark'
                              : status === 'Working' ? 'info'
                              : 'danger'
                            }`}>
                              {status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
    
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center gap-3 mt-3">
                  <button className="btn btn-outline-primary" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
                    ← Prev
                  </button>
                  <span className="align-self-center">Page {page + 1} of {totalPages}</span>
                  <button className="btn btn-outline-primary" disabled={page === totalPages - 1} onClick={() => setPage(p => p + 1)}>
                    Next →
                  </button>
                </div>
              )}
    
            </div>
          </div>
        </div>
      );
};

const SummaryCard = ({ title, value, color, icon }) => (
    <div className="col-md-3 col-sm-6">
      <div className={`attendance-card border-${color}`}>
  
        {/* Top colored section */}
        <div className={`card-top card-${color}`}>
          <div className={`icon-circle icon-circle-${color}`}>
            <i className={`bi bi-${icon} icon-${color}`}></i>
          </div>
          <span className="title">{title}</span>
        </div>
  
        {/* Bottom white section */}
        <div className="card-bottom">
          <span className={`value text-${color}`}>{value}</span>
        </div>
  
      </div>
    </div>
  );
  

export default ViewOwnAttendance;
