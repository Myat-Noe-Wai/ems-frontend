import React, { Component } from 'react';
import api from '../api/axiosConfig';
import moment from 'moment';

class EmpHomeComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            todayStatus: 'Loading...',
            remainingLeaves: 0,
            lastTimeIn: '-'
        };
    }

    componentDidMount() {
        this.fetchTodayAttendance();
        this.fetchRemainingLeaves();
        this.fetchLastTimeIn();
    }

    userId = () => {
        return localStorage.getItem('id');
    };

    // 🔹 Today’s attendance status
    fetchTodayAttendance = async () => {
        try {
            const userId = this.userId();
            const response = await api.get('/attendance/today', {
                params: { userId }
            });

            if (response.data?.clockIn) {
                this.setState({ todayStatus: 'Present' });
            } else {
                this.setState({ todayStatus: 'Absent' });
            }
        } catch (error) {
            this.setState({ todayStatus: 'Not Checked In' });
            console.error('Error fetching today attendance:', error);
        }
    };

    // 🔹 Remaining leave days
    fetchRemainingLeaves = async () => {
        try {
            const userId = localStorage.getItem('id');
            const response = await api.get('/leave-requests/leave-balance', {
                params: { userId }
            });
            console.log("Remaining leaves response: " + response);

            this.setState({ remainingLeaves: response.data.remainingDays });
        } catch (error) {
            console.error('Error fetching remaining leaves:', error);
        }
    };

    // 🔹 Last time-in
    fetchLastTimeIn = async () => {
        try {
            const userId = this.userId();
            const response = await api.get('/attendance/last', {
                params: { userId }
            });

            if (response.data?.clockIn) {
                this.setState({
                    lastTimeIn: moment(response.data.clockIn).format('YYYY-MM-DD HH:mm:ss')
                });
            }
        } catch (error) {
            console.error('Error fetching last time-in:', error);
        }
    };

    render() {
        const { todayStatus, remainingLeaves, lastTimeIn } = this.state;

        return (
            <div className="container mt-4">
                <h2>Employee Dashboard</h2>

                <div className="row mt-4">
                    <div className="col-md-4">
                        <div className="card text-white bg-success mb-3">
                            <div className="card-body">
                                <h5 className="card-title">Today’s Attendance</h5>
                                <p className="card-text">{todayStatus}</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card text-white bg-warning mb-3">
                            <div className="card-body">
                                <h5 className="card-title">Remaining Leave Days</h5>
                                <p className="card-text">{remainingLeaves}</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card text-white bg-primary mb-3">
                            <div className="card-body">
                                <h5 className="card-title">Last Time-In</h5>
                                <p className="card-text">{lastTimeIn}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default EmpHomeComponent;
