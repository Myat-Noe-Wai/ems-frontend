import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  async function login(event) {
    event.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/v1/user/login`, {
        email: email,
        password: password,
      });

      console.log(res.data.accessToken);

      if (!res.data.status) {
        alert(res.data.message);
        return;
      }

      // Save authentication info
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');      
      localStorage.setItem('id', res.data.id);
      localStorage.setItem('userName', res.data.userName);
      localStorage.setItem('email', res.data.email);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('accessToken', res.data.accessToken);

      // Navigate based on role
      if (res.data.role === 'admin') {
        navigate('/home');
      } else {
        navigate('/emp-home');
      }

    } catch (err) {
      console.error(err);
      alert("Login failed. Please check your credentials.");
    }
  }

  return (
    <div style={{ backgroundColor: "lightblue", height: "680px" }}>
      <div className="container">
        <div className="row">
          <h2 style={{ marginTop: "50px", marginLeft: "300px" }}>Employee Management System</h2>
          <h3 style={{ marginTop: "20px", marginLeft: "450px" }}>Login</h3>
          <hr />
        </div>
        <div className="row">
          <div className="col-sm-6" style={{ marginLeft: "230px" }}>
            <form>
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
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary" onClick={login} style={{ marginLeft: "190px", width: "100px" }}>
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
