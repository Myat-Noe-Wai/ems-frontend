import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from '../api/axiosConfig';

function Register({ setIsAuthenticated }) {
  const [employeename, setEmployeename] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function save(event) {
    event.preventDefault();
    try {
      const res = await api.post("/v1/user/save", {
        username: employeename,
        email,
        password,
      });

      console.log(res.data);

      if (!res.data.status) {
        alert(res.data.message);
        return;
      }

      alert("Employee registered successfully! Please login.");

      // Redirect after alert
      setTimeout(() => {
        navigate("/login");
      }, 100);
    } catch (err) {
      console.error(err);
      alert("Registration failed.");
    }
  }

  return (
    <div style={{ backgroundColor: "lightblue", height: "680px" }}>
      <div className="container">
        <div className="row">
          <h2 style={{ marginTop: "50px", marginLeft: "300px" }}>Employee Management System</h2>
          <h3 style={{ marginTop: "20px", marginLeft: "450px" }}>Register</h3>
        </div>
        <div className="row">
          <div className="col-sm-6" style={{ marginLeft: "230px" }}>
            <form>
              <div className="form-group">
                <label>User name</label>
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

              <button type="button" className="btn btn-primary mt-4" onClick={save}>
                Register
              </button>
              {/* 🔹 Optional: Already have an account link */}
              <div className="mt-3 text-center">
                <span>Already have an account? </span>
                <Link to="/login">Login here</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;