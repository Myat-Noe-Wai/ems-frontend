import React, { Component } from 'react';
import EmployeeService from '../services/EmployeeService';
import api from '../api/axiosConfig';
import moment from 'moment';

class HomeComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            totalEmployees: 0,
            todayPresent: 0,
            todayAbsent: 0,
            pendingLeaves: 0,
            recentAttendance: [] // array of { name, date, timeIn, timeOut, hours }
        };
    }

    componentDidMount() {
        this.fetchTotalEmployees();
        this.fetchTodayAttendance();
        this.fetchPendingLeaves();
        this.fetchRecentAttendance();
    }

    // 🔹 Fetch total employees
    fetchTotalEmployees = async () => {
        try {
            const response = await EmployeeService.getEmployees();
            this.setState({ totalEmployees: response.data.length });
        } catch (error) {
            console.error('Error fetching total employees:', error);
        }
    };

    // 🔹 Fetch today present and absent counts
    fetchTodayAttendance = async () => {
        try {
            const today = moment().format('YYYY-MM-DD');
            const response = await api.get('/attendance', {
                params: { fromDate: today, toDate: today }
            });

            const presentCount = response.data.filter(record => record.clockIn).length;
            const totalEmployees = this.state.totalEmployees; // current total
            const absentCount = totalEmployees - presentCount;

            this.setState({ todayPresent: presentCount, todayAbsent: absentCount });
        } catch (error) {
            console.error('Error fetching today attendance:', error);
        }
    };

    // 🔹 Fetch pending leave requests
    fetchPendingLeaves = async () => {
        try {
            const response = await api.get('/leave-requests', {
                params: { status: 'Pending', page: 0, size: 1000 } // get all pending
            });
            // Use totalElements from paginated response
            this.setState({ pendingLeaves: response.data.totalElements });
            console.log("Pending leaves: " + response.data.totalElements);
        } catch (error) {
            console.error('Error fetching pending leave requests:', error);
        }
    };    

    // 🔹 Fetch recent attendance (last 5 records)
    fetchRecentAttendance = async () => {
        try {
            const response = await api.get('/attendance', {
                params: { page: 0, size: 5, sort: 'date,DESC' } // assuming backend supports pagination
            });

            const recent = response.data.map(record => ({
                name: record.employeeName,
                date: moment(record.date).format('YYYY-MM-DD'),
                timeIn: this.formatTime(record.clockIn),
                timeOut: this.formatTime(record.clockOut),
                hours: this.calculateHours(record.clockIn, record.clockOut),
            }));

            this.setState({ recentAttendance: recent });
        } catch (error) {
            console.error('Error fetching recent attendance:', error);
        }
    };

    // 🔹 Format clockIn/clockOut
    formatTime = (dateTime) => {
        if (!dateTime) return '-';
        return moment(dateTime).format('HH:mm:ss');
    };

    // 🔹 Calculate hours between clockIn and clockOut
    calculateHours = (clockIn, clockOut) => {
        if (!clockIn || !clockOut) return '';
        const start = moment(clockIn);
        const end = moment(clockOut);
        const hours = moment.duration(end.diff(start)).asHours();
        return hours.toFixed(1);
    };

    render() {
        const { totalEmployees, todayPresent, todayAbsent, pendingLeaves, recentAttendance } = this.state;

        return (
            <div className="container mt-4">                
                <div className="row my-4">
                    <div className="col-md-3">
                        <div className="card text-white bg-primary mb-3">
                            <div className="card-body">
                                <h5 className="card-title">Total Employees</h5>
                                <p className="card-text">{totalEmployees}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card text-white bg-success mb-3">
                            <div className="card-body">
                                <h5 className="card-title">Today Present</h5>
                                <p className="card-text">{todayPresent}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card text-white bg-danger mb-3">
                            <div className="card-body">
                                <h5 className="card-title">Today Absent</h5>
                                <p className="card-text">{todayAbsent}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card text-white bg-warning mb-3">
                            <div className="card-body">
                                <h5 className="card-title">Pending Leave Requests</h5>
                                <p className="card-text">{pendingLeaves}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 🔹 Recent Attendance Table */}
                <div className="">
                    <h4>Recent Attendance</h4>
                    <table className="table table-bordered table-striped table-hover">
                        <thead className="table-primary">
                            <tr>
                                <th>Employee Name</th>
                                <th>Date</th>
                                <th>Time In</th>
                                <th>Time Out</th>
                                <th>Hours</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentAttendance.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center">No recent attendance found</td>
                                </tr>
                            ) : (
                                recentAttendance.map((att, index) => (
                                    <tr key={index}>
                                        <td>{att.name}</td>
                                        <td>{att.date}</td>
                                        <td>{att.timeIn}</td>
                                        <td>{att.timeOut}</td>
                                        <td>{att.hours}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default HomeComponent;
