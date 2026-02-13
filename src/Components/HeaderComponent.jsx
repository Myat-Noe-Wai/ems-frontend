import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { startSessionTimer, stopSessionTimer } from "../utils/sessionTimeout";
import { logoutUser } from "../utils/logout";

const HeaderComponent = ({ setIsAuthenticated, setRole }) => {
    const navigate = useNavigate();
    const [activeLink, setActiveLink] = useState('/');   // existing
    const [showAccountMenu, setShowAccountMenu] = useState(false); // ✅ ADDED
    const [showWarning, setShowWarning] = useState(false);

    // read user info
    const userName = localStorage.getItem('userName');
    const email = localStorage.getItem('email');
    const menuRef = useRef(null);
    const iconRef = useRef(null);

    const handleLinkClick = (path) => {
        setActiveLink(path);
        navigate(path);
    };

    const logout = () => {
        stopSessionTimer(); // ✅ stop background timer
        setIsAuthenticated(false);
        setRole(null);
        localStorage.clear();
        navigate('/login', { replace: true });
    };

    // ✅ SESSION TIMER EFFECT (ADD THIS)
    useEffect(() => {
        const isAuth = localStorage.getItem("isAuthenticated");
    
        if (isAuth) {
            startSessionTimer(
                () => logoutUser(navigate, setIsAuthenticated),
                () => setShowWarning(true)
            );
        }
    
        return () => stopSessionTimer();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                iconRef.current &&
                !iconRef.current.contains(event.target)
            ) {
                setShowAccountMenu(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Hide warning popup on activity
    useEffect(() => {
        if (!showWarning) return;

        const hideWarning = () => setShowWarning(false);

        window.addEventListener("mousemove", hideWarning);
        window.addEventListener("keydown", hideWarning);

        return () => {
            window.removeEventListener("mousemove", hideWarning);
            window.removeEventListener("keydown", hideWarning);
        };
    }, [showWarning]);

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
                                onClick={() => handleLinkClick('/jobtitles')}
                                style={{ fontWeight: activeLink === '/jobtitles' ? 'bold' : 'normal', color: "white" }}
                            >
                                Manage Job Titles
                            </a>
                        </li>
                    </ul>

                    <div className="position-relative mr-3">
                        <div
                            ref={iconRef}
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
                                ref={menuRef}
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

            {/* ⚠ WARNING MODAL */}
            {showWarning && (
                <div style={{ position: "fixed", top:0, left:0, width:"100%", height:"100%", background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999 }}>
                    <div style={{ background:"white", padding:"25px", borderRadius:"10px", textAlign:"center", width:"350px" }}>
                        <h4>Session Expiring</h4>
                        <p>You will be logged out in 60 seconds due to inactivity.</p>
                        <button className="btn btn-primary" onClick={() => setShowWarning(false)}>Stay Logged In</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeaderComponent;
