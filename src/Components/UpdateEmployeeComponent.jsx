import React, { useState, useEffect } from 'react';
import EmployeeService from '../services/EmployeeService';
import RoleService from '../services/RoleService';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateEmployeeComponent = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [emailId, setEmailId] = useState('');
    const [contactInfo, setContact] = useState('');
    const [address, setAddress] = useState('');
    const [gender, setGender] = useState('');
    const [joiningDate, setJoiningDate] = useState('');
    const [salary, setSalary] = useState('');
    const [leaveDay, setLeaveDay] = useState('');
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');

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
            setSelectedRole(employee.role);
        });

        RoleService.getRoles().then((res) => {
            if (Array.isArray(res.data)) {
                setRoles(res.data);
            } else {
                setRoles([]);
            }
        }).catch(err => {
            console.error("Error fetching roles: ", err);
            setRoles([]);
        });
    }, [id]);

    const updateEmployee = (e) => {
        e.preventDefault();
        let employee = { firstName, lastName, dateOfBirth, emailId, contactInfo, address, gender, joiningDate, salary, leaveDay, role: selectedRole };
        console.log('employee => ' + JSON.stringify(employee));

        EmployeeService.updateEmployee(employee, id).then(res => {
            navigate('/employees'); // Navigate to '/employees' after successful save
        });
    };

    const cancel = () => {
        navigate('/employees'); // Navigate to '/employees' when cancel is clicked
    };

    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
    };

    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
    };

    const handleDateOfBirthChange = (event) => {
        setDateOfBirth(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmailId(event.target.value);
    };

    const handleContactChange = (event) => {
        setContact(event.target.value);
    };

    const handleAddressChange = (event) => {
        setAddress(event.target.value);
    };

    const handleGenderChange = (event) => {
        setGender(event.target.value);
    };

    const handleJoiningDateChange = (event) => {
        setJoiningDate(event.target.value);
    };

    const handleSalaryChange = (event) => {
        setSalary(event.target.value);
    };

    const handleLeaveDayChange = (event) => {
        setLeaveDay(event.target.value);
    };

    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
    };

    return (
        <div>
            <div className="container" style={{ marginTop: "10px" }}>
                <div className="row">
                    <div className="card col-md-6 offset-md-3 offset-md-3">
                        <h3 className="text-center">Update Employee</h3>
                        <div className="card-body">
                            <form>
                                <div className="row">
                                    <div className="form-group col-md-6">
                                        <label>First name</label>
                                        <input
                                            placeholder="First Name"
                                            name="firstName"
                                            className="form-control"
                                            value={firstName}
                                            onChange={handleFirstNameChange}
                                        />
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label>Last name</label>
                                        <input
                                            placeholder="Last Name"
                                            name="lastName"
                                            className="form-control"
                                            value={lastName}
                                            onChange={handleLastNameChange}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="form-group col-md-6">
                                        <label>Date Of Birth</label>
                                        <input
                                            type="date"
                                            name="date"
                                            className="form-control"
                                            value={dateOfBirth}
                                            onChange={handleDateOfBirthChange}
                                        />
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label>Email</label>
                                        <input
                                            placeholder="email"
                                            type="emailId"
                                            name="emailId"
                                            className="form-control"
                                            value={emailId}
                                            onChange={handleEmailChange}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="form-group col-md-6">
                                        <label>Contact Info</label>
                                        <input
                                            placeholder="Contact Info"
                                            type="contact"
                                            name="contact"
                                            className="form-control"
                                            value={contactInfo}
                                            onChange={handleContactChange}
                                        />
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label>Address</label>
                                        <input
                                            placeholder="Address"
                                            type="address"
                                            name="address"
                                            className="form-control"
                                            value={address}
                                            onChange={handleAddressChange}
                                        />
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label>Joining Date</label>
                                        <input
                                            placeholder="Joining Date"
                                            type="joiningDate"
                                            name="joiningDate"
                                            className="form-control"
                                            value={joiningDate}
                                            onChange={handleJoiningDateChange}
                                        />
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label>Salary</label>
                                        <input
                                            placeholder="Salary"
                                            type="salary"
                                            name="salary"
                                            className="form-control"
                                            value={salary}
                                            onChange={handleSalaryChange}
                                        />
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label>Leave Day</label>
                                        <input
                                            placeholder="Leave Day"
                                            type="leaveDay"
                                            name="leaveDay"
                                            className="form-control"
                                            value={leaveDay}
                                            onChange={handleLeaveDayChange}
                                        />
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label>Role</label>
                                        <select value={selectedRole} onChange={handleRoleChange} className="form-control">
                                            <option value="">Select Role</option>
                                            {roles.map(role => (
                                                <option key={role.id} value={role.name}>
                                                    {role.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="form-group col-md-6">
                                        <label>Gender</label>
                                        <input style={{ marginLeft: "10px" }} type="radio" id="male" name="gender" value="Male"
                                            onChange={handleGenderChange} checked={gender === "Male"} />
                                        <label style={{ marginLeft: "5px" }}>Male</label>
                                        <input style={{ marginLeft: "10px" }} type="radio" id="female" name="gender" value="Female"
                                            onChange={handleGenderChange} checked={gender === "Female"} />
                                        <label style={{ marginLeft: "5px" }}>Female</label>
                                    </div>
                                </div>
                                <button className="btn btn-success" onClick={updateEmployee}>Save</button>
                                <button className="btn btn-danger" onClick={cancel} style={{ marginLeft: "10px" }}>Cancel</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default UpdateEmployeeComponent;
