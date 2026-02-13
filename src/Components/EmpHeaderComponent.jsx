import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { startSessionTimer, stopSessionTimer } from "../utils/sessionTimeout";
import { logoutUser } from "../utils/logout";

const HeaderComponent = ({ setIsAuthenticated, setRole }) => {
    const navigate = useNavigate();
    const [activeLink, setActiveLink] = useState('/'); // Track the active menu item
    const [showMenu, setShowMenu] = useState(false);
    const [showWarning, setShowWarning] = useState(false);

    const userName = localStorage.getItem('userName');
    const email = localStorage.getItem('email');
    const menuRef = useRef(null);
    const iconRef = useRef(null);

    const handleLinkClick = (path) => {
        setActiveLink(path);  // Update the active link state
        navigate(path);  // Programmatically navigate to the clicked path
    };

    const toggleMenu = () => {
        setShowMenu(!showMenu);
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
                setShowMenu(false);
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
            <nav className="navbar navbar-dark navbar-expand-md bg-primary px-3">
                <a className="navbar-brand" href="#">Employee Management System</a>

                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <a
                                className="nav-link"
                                href="#"
                                onClick={() => handleLinkClick('/')}
                                style={{ fontWeight: activeLink === '/' ? 'bold' : 'normal', color: activeLink === '/' ? 'white' : '#dad7d7' }}
                            >
                                Home
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className="nav-link"
                                href="#"
                                onClick={() => handleLinkClick('/times-in-out')}
                                style={{ fontWeight: activeLink === '/times-in-out' ? 'bold' : 'normal', color: activeLink === '/times-in-out' ? 'white' : '#dad7d7' }}
                            >
                                Times In/Out
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className="nav-link"
                                href="#"
                                onClick={() => handleLinkClick('/request-leave')}
                                style={{ fontWeight: activeLink === '/request-leave' ? 'bold' : 'normal', color: activeLink === '/request-leave' ? 'white' : '#dad7d7' }}
                            >
                                Request Leave
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className="nav-link"
                                href="#"
                                onClick={() => handleLinkClick('/my-attendance')}
                                style={{
                                    fontWeight: activeLink === '/my-attendance' ? 'bold' : 'normal',
                                    color: activeLink === '/my-attendance' ? 'white' : '#dad7d7'
                                }}
                            >
                                View Attendance
                            </a>
                        </li>
                    </ul>

                    {/* ACCOUNT ICON */}
                    <div className="position-relative">
                        <div
                            ref={iconRef}
                            onClick={toggleMenu}
                            className="rounded-circle bg-light text-primary d-flex justify-content-center align-items-center"
                            style={{
                                width: '36px',
                                height: '36px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            {userName?.charAt(0).toUpperCase()}
                        </div>

                        {showMenu && (
                            <div
                                ref={menuRef}
                                className="position-absolute bg-white shadow rounded p-3"
                                style={{ right: 0, top: '45px', minWidth: '140px', zIndex: 2000 }}
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
