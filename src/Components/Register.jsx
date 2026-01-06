import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register({ setIsAuthenticated }) {
  const [employeename, setEmployeename] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  async function save(event) {
    event.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/v1/user/save`, {
        username: employeename,
        email: email,
        password: password,
      });

      console.log(res.data);

      if (!res.data.status) {
        alert(res.data.message);
        return;
      }

      // Save JWT token and basic info
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('accessToken', res.data.data.accessToken);
      localStorage.setItem('id', res.data.data.userId);
      localStorage.setItem('empName', res.data.data.username);
      localStorage.setItem('role', res.data.data.role); // will be "employee" by default

      alert("Employee Registration Successfully");
      navigate('/emp-home'); // auto-login and redirect
    } catch (err) {
      console.error(err);
      alert("Registration failed.");
    }
  }

  return (
    <div className="container mt-4">
      <div className="card p-4">
        <h1>Employee Registration</h1>
        <form>
          <div className="form-group">
            <label>Employee name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Name"
              value={employeename}
              onChange={(e) => setEmployeename(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary mt-4" onClick={save}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;