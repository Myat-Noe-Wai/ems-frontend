import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HeaderComponent = ({ setIsAuthenticated, setRole }) => {
    const navigate = useNavigate();
    const [activeLink, setActiveLink] = useState('/');  // Default active link is home

    const handleLinkClick = (path) => {
        setActiveLink(path);  // Update the active link
        navigate(path);  // Navigate to the clicked path
    };

    const logout = () => {
        // localStorage.removeItem('isAuthenticated');
        // navigate('/login');

        setIsAuthenticated(false);
        setRole(null);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('role');
        localStorage.removeItem('id');
        localStorage.removeItem('empName');
        navigate('/login', { replace: true });
    };

    return (
        <div>
            <nav className="navbar navbar-dark navbar-expand-md bg-primary" style={{ backgroundColor: "#e3f2fd" }}>
                <a className="navbar-brand" href="#">Employee Management System</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
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
                        <li className="nav-item">
                            <a
                                className="nav-link"
                                href="#"
                                onClick={logout}
                                style={{ color: "white" }}
                            >
                                Logout
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    );
};

export default HeaderComponent;
