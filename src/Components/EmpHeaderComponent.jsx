import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HeaderComponent = ({ setIsAuthenticated, setRole }) => {
    const navigate = useNavigate(); 
    const [activeLink, setActiveLink] = useState('/');  // Track the active menu item

    const handleLinkClick = (path) => {
        setActiveLink(path);  // Update the active link state
        navigate(path);  // Programmatically navigate to the clicked path
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
                                onClick={logout}
                                style={{ color: "#dad7d7" }}
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
