import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import EmployeeService from '../services/EmployeeService';

const ViewEmployeeComponent = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [emailId, setEmailId] = useState('');
    const [contact, setContact] = useState('');
    const [address, setAddress] = useState('');
    const [gender, setGender] = useState('');
    const [joiningDate, setJoiningDate] = useState('');
    const [salary, setSalary] = useState('');
    const [leaveDay, setLeaveDay] = useState('');
    const [role, setRole] = useState('');

    useEffect(() => {
        EmployeeService.getEmployeeById(id).then((res) => {
            let employee = res.data;
            setFirstName(employee.firstName);
            setLastName(employee.lastName);
            setDateOfBirth(employee.dateOfBirth);
            setEmailId(employee.emailId);
            setContact(employee.contactInfo);
            setAddress(employee.address);
            setGender(employee.gender);
            setJoiningDate(employee.joiningDate);
            setSalary(employee.salary);
            setLeaveDay(employee.leaveDay);
            setRole(employee.jobTitle);
        });
    }, [id]);

    const cancel = () => {
        navigate('/employees'); // Navigate to '/employees' when cancel is clicked
    };

        return (
            <div>
                <br></br>
                <div className = "card col-md-6 offset-md-3">                
                    <h3 className = "text-center"> View Employee Details</h3>
                    <div className = "card-body">
                        <div className = "row">
                            <label className="col-md-6"> Employee First Name: </label>
                            <div className="col-md-6"> { firstName }</div>
                        </div>
                        <div className = "row">
                            <label className="col-md-6"> Employee Last Name: </label>
                            <div className="col-md-6"> { lastName }</div>
                        </div>
                        <div className = "row">
                            <label className="col-md-6"> Date of Birth: </label>
                            <div className="col-md-6"> { new Date(dateOfBirth).toLocaleDateString() }</div>
                        </div>
                        <div className = "row">
                            <label className="col-md-6"> Employee Email ID: </label>
                            <div className="col-md-6"> { emailId }</div>
                        </div>
                        <div className = "row">
                            <label className="col-md-6"> Contact: </label>
                            <div className="col-md-6"> { contact }</div>
                        </div>
                        <div className = "row">
                            <label className="col-md-6"> Address: </label>
                            <div className="col-md-6"> { address }</div>
                        </div>
                        <div className = "row">
                            <label className="col-md-6"> Gender: </label>
                            <div className="col-md-6"> { gender }</div>
                        </div>                        
                        <div className = "row">
                            <label className="col-md-6"> Joining Date: </label>
                            <div className="col-md-6"> { new Date(joiningDate).toLocaleDateString() }</div>
                        </div>
                        <div className = "row">
                            <label className="col-md-6"> Salary: </label>
                            <div className="col-md-6"> { salary }</div>
                        </div>
                        <div className = "row">
                            <label className="col-md-6"> Leave Day: </label>
                            <div className="col-md-6"> { leaveDay }</div>
                        </div>
                        <div className = "row">
                            <label className="col-md-6"> Role: </label>
                            <div className="col-md-6"> { role }</div>
                        </div>
                    </div>
                    <button className="btn btn-success" onClick={cancel} style={{ marginLeft: "10px", marginBottom: "10px" }}>Back</button>
                </div>
            </div>
        )
};

export default ViewEmployeeComponent