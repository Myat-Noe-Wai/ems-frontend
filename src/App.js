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
import RoleManagement from './Components/RoleManagement';
import AttendanceTrackingComponent from './Components/AttendanceTrackingComponent';
import LeaveRequest from './Components/LeaveRequest';
import EmployeeAttendance from './Components/EmployeeAttendance';
import Register from './Components/Register';
import Login from './Components/Login';
import EmpHeaderComponent from './Components/EmpHeaderComponent';
import React, { useState,useEffect } from 'react';
import EmployeeLeaveRequest from './Components/EmployeeLeaveRequest';

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
                        <>
                          <HeaderComponent setIsAuthenticated={setIsAuthenticated} setRole={setRole}/>
                          {/* <HeaderComponent/> */}
                          <HomeComponent />
                          <FooterComponent />
                        </>
                      }/>
                      <Route path="/" element={
                        <>
                          <HeaderComponent />
                          <HomeComponent />
                          <FooterComponent />
                        </>
                      }/>
                    <Route path="/roles" element={
                        <>
                          <HeaderComponent />
                          <RoleManagement />
                          <FooterComponent />
                        </>
                      }/>
                    <Route path="/employees" element={
                        <>
                          <HeaderComponent />
                          <ListEmployeeComponent />
                          <FooterComponent />
                        </>
                      }/>
                    <Route path="/add-employee" element={
                        <>
                          <HeaderComponent />
                          <CreateEmployeeComponent />
                          <FooterComponent />
                        </>
                      }/>
                    <Route path="/update-employee/:id" element={
                        <>
                          <HeaderComponent />
                          <UpdateEmployeeComponent />
                          <FooterComponent />
                        </>
                      }/>
                    <Route path="/view-employee/:id" element={
                        <>
                          <HeaderComponent />
                          <ViewEmployeeComponent />
                          <FooterComponent />
                        </>
                      }/>
                    <Route path="/attendance" element={
                        <>
                          <HeaderComponent />
                          <AttendanceTrackingComponent />
                          <FooterComponent />
                        </>
                      }/>
                    <Route path="/leave-request" element={
                        <>
                          <HeaderComponent />
                          <LeaveRequest />
                          <FooterComponent />
                        </>
                      }/>
                    <Route path="/employee-attendance" element={
                        <>
                          <HeaderComponent />
                          <EmployeeAttendance />
                          <FooterComponent />
                        </>
                      }/>
                    </>
                    ) : (
                      <>
                      <Route path="/emp-home" element={
                        <>
                          <EmpHeaderComponent setIsAuthenticated={setIsAuthenticated} setRole={setRole} />
                          {/* <EmpHeaderComponent/> */}
                          <EmpHomeComponent />
                          <FooterComponent />
                        </>
                      }/>
                      <Route path="/" element={
                        <>
                          <EmpHeaderComponent />
                          <EmpHomeComponent />
                          <FooterComponent />
                        </>
                      }/>
                      <Route path="/times-in-out" element={
                        <>
                          <EmpHeaderComponent setIsAuthenticated={setIsAuthenticated} setRole={setRole}/>
                          <EmployeeAttendance />
                          <FooterComponent />
                        </>
                      }/>
                      <Route path="/request-leave" element={
                        <>
                          <EmpHeaderComponent />
                          <EmployeeLeaveRequest />
                          <FooterComponent />
                        </>
                      }/>
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
