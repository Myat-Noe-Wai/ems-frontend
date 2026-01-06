import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeService from '../services/EmployeeService';

const ListEmployeeComponent = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        EmployeeService.getEmployees().then((res) => {
            setEmployees(res.data);
        });
        
    }, []);

    const deleteEmployee = (id) => {
        EmployeeService.deleteEmployee(id).then((res) => {
            setEmployees(employees.filter(employee => employee.id !== id));
        }).catch(error => {
            console.error("There was an error deleting the employee!", error);
        });
    }

    const addEmployee = () => {
        navigate('/add-employee');
    };

    const viewEmployee = (id) => {
        navigate(`/view-employee/${id}`);
    }

    const editEmployee = (id) => {
        navigate(`/update-employee/${id}`);
    }

        return (
            <div>
            <h2 className="text-center">Employee List</h2>
            <div className="row">
                <button className="btn btn-primary" style={{marginBottom: "10px"}} onClick={addEmployee}>Add Employee</button>
            </div>
            <div className="row">
                <table className="table table-striped table-bordered">
                    <thead className="table-primary">
                        <tr>
                            <th>ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Date of Birth</th>
                            <th>Email</th>                            
                            <th>Contact Info</th>
                            <th>Address</th>
                            <th>Gender</th>
                            <th>Joining Date</th>
                            <th>Salary</th>
                            <th>Leave Day</th>                            
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            employees.map(employee => (                            
                                <tr>
                                    <td>{employee.id}</td>
                                    <td>{employee.firstName}</td>
                                    <td>{employee.lastName}</td>
                                    <td>{new Date(employee.dateOfBirth).toLocaleDateString()}</td>
                                    <td>{employee.emailId}</td>                                    
                                    <td>{employee.contactInfo}</td>
                                    <td>{employee.address}</td>
                                    <td>{employee.gender}</td>
                                    <td>{new Date(employee.joiningDate).toLocaleDateString()}</td>
                                    <td>{employee.salary}</td>
                                    <td>{employee.leaveDay}</td>
                                    <td>{employee.jobTitle}</td>
                                    <td>                                        
                                        <button style={{marginLeft : "10px"}}
                                        className="btn btn-success" onClick={()=>editEmployee(employee.id)}>
                                            Update
                                        </button>                                        
                                        <button style={{marginLeft : "10px", marginTop: "10px", width: "79px"}}
                                         className="btn btn-info" onClick={()=>viewEmployee(employee.id)}>
                                            View
                                        </button>
                                        <button style={{marginLeft : "10px", marginTop: "10px", width: "79px"}}
                                        className="btn btn-danger" onClick={()=>deleteEmployee(employee.id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
        )
    
};

export default ListEmployeeComponent