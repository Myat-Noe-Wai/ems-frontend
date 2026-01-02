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
        await axios.post(`${API_BASE_URL}/v1/user/login`, {
        email: email,
        password: password,
      }).then((res) => {
        console.log(res.data);

        if (res.data.message === "Email not exists") {
          alert("Email not exists");
        } else if (res.data.message === "Admin Login Success") {
          setIsAuthenticated(true);
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('role', 'admin');
          navigate('/home');
        } else if (res.data.message === "Employee Login Success") {
          setIsAuthenticated(true);
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('role', 'employee');
          localStorage.setItem('id', res.data.id);
          localStorage.setItem('empName', res.data.empName);
          navigate('/emp-home');
        } else {
          alert("Incorrect Email or Password");
        }
      }, fail => {
        console.error(fail);
      });
    } catch (err) {
      alert(err);
    }
  }

  return (
    <div style={{backgroundColor: "lightblue", height: "680px"}}>
      <div className="container">
        <div className="row">
          <h2 style={{marginTop: "50px", marginLeft: "300px"}}>Employee Management System</h2>
          <h3 style={{marginTop: "20px", marginLeft: "450px"}}>Login</h3>
          <hr />
        </div>
        <div className="row">
          <div className="col-sm-6" style={{marginLeft: "230px"}}>
            <form>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary" onClick={login} style={{marginLeft: "190px", width: "100px"}}>
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
