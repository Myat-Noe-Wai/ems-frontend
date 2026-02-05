import logo from './logo.svg';
import './App.css';
import HeaderComponent from './Components/HeaderComponent';
import FooterComponent from './Components/FooterComponent';
import ListEmployeeComponent from './Components/ListEmployeeComponent';
import CreateEmployeeComponent from './Components/CreateEmployeeComponent';
import ViewEmployeeComponent from './Components/ViewEmployeeComponent';
import UpdateEmployeeComponent from './Components/UpdateEmployeeComponent';
import HomeComponent from './Components/HomeComponent';
import EmpHomeComponent from './Components/EmpHomeComponent';
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import JobTitleManagement from './Components/JobTitleManagement';
import AttendanceTrackingComponent from './Components/AttendanceTrackingComponent';
import LeaveRequest from './Components/LeaveRequest';
import EmployeeAttendance from './Components/EmployeeAttendance';
import Register from './Components/Register';
import Login from './Components/Login';
import EmpHeaderComponent from './Components/EmpHeaderComponent';
import React, { useState,useEffect } from 'react';
import EmployeeLeaveRequest from './Components/EmployeeLeaveRequest';
import ViewOwnAttendance from './Components/ViewOwnAttendance';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );
  // const role = localStorage.getItem('role');
  const [role, setRole] = useState(localStorage.getItem('role'));
  console.log("authen");
  console.log(isAuthenticated);
  console.log(role);

  // Update localStorage when authentication status changes
  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);
  console.log("isAuthenticated");
  console.log(localStorage.getItem('isAuthenticated'));

  // Update role when user logs in
  useEffect(() => {
    setRole(localStorage.getItem('role'));
  }, [isAuthenticated]);
  console.log("role");
  console.log(localStorage.getItem('role'));

  return (
    <div>
      <Router>
        <div>
          <div style={{ marginLeft: "40px", marginRight: "40px" }}>
            <Routes key={role}>
              {/* Login and Register routes without HeaderComponent */}
              <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/register" element={<Register />} />

              {/* Private routes that include HeaderComponent */}
              {isAuthenticated ? (
                <>
                  {role === 'admin' ? (
                    <>
                      <Route path="/home" element={
                        <div className="app-layout">
                          <HeaderComponent
                            setIsAuthenticated={setIsAuthenticated}
                            setRole={setRole}
                          />

                          <div className="page-content">
                            <HomeComponent />
                          </div>

                          {/* <FooterComponent /> */}
                        </div>
                      }/>
                      <Route path="/" element={
                        <>
                          <div className="app-layout">
                            <HeaderComponent setIsAuthenticated={setIsAuthenticated} setRole={setRole}/>
                            <div className="page-content">
                              <HomeComponent />
                            </div>
                            {/* <FooterComponent /> */}
                          </div>
                        </>
                      }/>
                    <Route path="/jobtitles" element={
                        <>
                          <div className="app-layout">
                            <HeaderComponent setIsAuthenticated={setIsAuthenticated} setRole={setRole}/>
                            <div className="page-content">
                              <JobTitleManagement />
                            </div>
                            {/* <FooterComponent /> */}
                          </div>
                        </>
                      }/>
                    <Route path="/employees" element={
                        <>
                          <div className="app-layout">
                            <HeaderComponent setIsAuthenticated={setIsAuthenticated} setRole={setRole} />
                            <div className="page-content">
                              <ListEmployeeComponent />
                            </div>
                            {/* <FooterComponent /> */}
                          </div>
                        </>
                      }/>
                    <Route path="/add-employee" element={
                        <>
                          <HeaderComponent setIsAuthenticated={setIsAuthenticated} setRole={setRole}/>
                          <CreateEmployeeComponent />
                          {/* <FooterComponent /> */}
                        </>
                      }/>
                    <Route path="/update-employee/:id" element={
                        <>
                          <HeaderComponent setIsAuthenticated={setIsAuthenticated} setRole={setRole}/>
                          <UpdateEmployeeComponent />
                          {/* <FooterComponent /> */}
                        </>
                      }/>
                    <Route path="/view-employee/:id" element={
                        <>
                          <HeaderComponent setIsAuthenticated={setIsAuthenticated} setRole={setRole}/>
                          <ViewEmployeeComponent />
                          {/* <FooterComponent /> */}
                        </>
                      }/>
                    <Route path="/attendance" element={
                        <>
                          <div className="app-layout">
                            <HeaderComponent setIsAuthenticated={setIsAuthenticated} setRole={setRole}/>
                            <div className="page-content">
                              <AttendanceTrackingComponent />
                            </div>
                            {/* <FooterComponent /> */}
                          </div>
                        </>
                      }/>
                    <Route path="/leave-request" element={
                        <>
                          <div className="app-layout">
                            <HeaderComponent setIsAuthenticated={setIsAuthenticated} setRole={setRole}/>
                            <div className="page-content">
                              <LeaveRequest />
                            </div>
                            {/* <FooterComponent /> */}
                          </div>
                        </>
                      }/>
                    <Route path="/employee-attendance" element={
                        <>
                          <div className="app-layout">
                            <HeaderComponent setIsAuthenticated={setIsAuthenticated} setRole={setRole}/>
                            <div className="page-content">
                              <EmployeeAttendance />
                            </div>
                            {/* <FooterComponent /> */}
                          </div>
                        </>
                      }/>
                    </>
                    ) : (
                      <>
                        <Route path="/emp-home" element={
                          <>
                            <div className="app-layout">
                              <EmpHeaderComponent setIsAuthenticated={setIsAuthenticated} setRole={setRole} />                        
                              <div className="page-content">
                                <EmpHomeComponent />
                              </div>
                              {/* <FooterComponent /> */}
                            </div>
                          </>
                        }/>
                        <Route path="/" element={
                          <>
                            <div className="app-layout">
                              <EmpHeaderComponent setIsAuthenticated={setIsAuthenticated} setRole={setRole}/>
                              <div className="page-content">
                                <EmpHomeComponent />
                              </div>
                              {/* <FooterComponent /> */}
                            </div>
                          </>
                        }/>
                        <Route path="/times-in-out" element={
                          <>
                            <div className="app-layout">
                              <EmpHeaderComponent setIsAuthenticated={setIsAuthenticated} setRole={setRole}/>
                              <div className="page-content">
                                <EmployeeAttendance />
                              </div>
                              {/* <FooterComponent /> */}
                            </div>
                          </>
                        }/>
                        <Route path="/request-leave" element={
                          <>
                            <div className="app-layout">
                              <EmpHeaderComponent setIsAuthenticated={setIsAuthenticated} setRole={setRole}/>
                              <div className="page-content">
                                <EmployeeLeaveRequest />
                              </div>
                              {/* <FooterComponent /> */}
                            </div>
                          </>
                        }/>
                        <Route path="/my-attendance" element={
                          <>
                            <div className="app-layout">
                              <EmpHeaderComponent setIsAuthenticated={setIsAuthenticated} setRole={setRole}/>
                              <div className="page-content">
                                <ViewOwnAttendance />
                              </div>
                              {/* <FooterComponent /> */}
                            </div>
                          </>
                        }/>
                        {/* <Route path="/my-attendance" element={<ViewOwnAttendance />} /> */}
                      </>
                    )}
                </>
              ) : (
                // Redirect to login if the user is not authenticated
                <Route path="*" element={<Navigate to="/login" />} />
              )}
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
