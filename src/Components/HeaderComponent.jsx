import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HeaderComponent = ({ setIsAuthenticated, setRole }) => {
    const navigate = useNavigate();
    const [activeLink, setActiveLink] = useState('/');   // existing
    const [showAccountMenu, setShowAccountMenu] = useState(false); // ✅ ADDED

    // read user info
    const userName = localStorage.getItem('userName');
    const email = localStorage.getItem('email');

    const handleLinkClick = (path) => {
        setActiveLink(path);
        navigate(path);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setRole(null);

        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('role');
        localStorage.removeItem('id');
        localStorage.removeItem('empName');
        localStorage.removeItem('userName');
        localStorage.removeItem('email');

        navigate('/login', { replace: true });
    };

    return (
        <div>
            <nav className="navbar navbar-dark navbar-expand-md bg-primary">
                <a className="navbar-brand" href="#">Employee Management System</a>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarSupportedContent"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <a
                                className="nav-link"
                                href="#"
                                onClick={() => handleLinkClick('/')}
                                style={{ fontWeight: activeLink === '/' ? 'bold' : 'normal', color: "white" }}
                            >
                                Home
                            </a>
                        </li>

                        <li className="nav-item">
                            <a
                                className="nav-link"
                                href="#"
                                onClick={() => handleLinkClick('/employees')}
                                style={{ fontWeight: activeLink === '/employees' ? 'bold' : 'normal', color: "white" }}
                            >
                                Manage Employee
                            </a>
                        </li>

                        <li className="nav-item">
                            <a
                                className="nav-link"
                                href="#"
                                onClick={() => handleLinkClick('/jobtitles')}
                                style={{ fontWeight: activeLink === '/jobtitles' ? 'bold' : 'normal', color: "white" }}
                            >
                                Manage Job Titles
                            </a>
                        </li>

                        <li className="nav-item">
                            <a
                                className="nav-link"
                                href="#"
                                onClick={() => handleLinkClick('/attendance')}
                                style={{ fontWeight: activeLink === '/attendance' ? 'bold' : 'normal', color: "white" }}
                            >
                                Attendance Tracking
                            </a>
                        </li>

                        <li className="nav-item">
                            <a
                                className="nav-link"
                                href="#"
                                onClick={() => handleLinkClick('/leave-request')}
                                style={{ fontWeight: activeLink === '/leave-request' ? 'bold' : 'normal', color: "white" }}
                            >
                                Manage Leave Request
                            </a>
                        </li>
                    </ul>

                    <div className="position-relative mr-3">
                        <div
                            onClick={() => setShowAccountMenu(!showAccountMenu)}
                            className="rounded-circle bg-light text-primary d-flex justify-content-center align-items-center"
                            style={{
                                width: '36px',
                                height: '36px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            {userName ? userName.charAt(0).toUpperCase() : 'A'}
                        </div>

                        {showAccountMenu && (
                            <div
                                className="position-absolute bg-white shadow rounded p-3"
                                style={{
                                    right: 0,
                                    top: '45px',
                                    minWidth: '220px',
                                    zIndex: 1000
                                }}
                            >
                                <div className="text-center">
                                    <strong>{userName}</strong>
                                    <div className="text-muted small">{email || 'No email'}</div>
                                </div>
                                <hr />
                                <button
                                    className="btn btn-outline-danger btn-sm btn-block"
                                    onClick={logout}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default HeaderComponent;
