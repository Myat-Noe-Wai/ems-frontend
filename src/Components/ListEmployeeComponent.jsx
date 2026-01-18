import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import EmployeeService from '../services/EmployeeService';

const ListEmployeeComponent = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [employeesPerPage] = useState(5); // show 5 per page (you can adjust)
    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);
    const location = useLocation();
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        EmployeeService.getEmployees().then((res) => {
            setEmployees(res.data);
            setFilteredEmployees(res.data);
        });
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
    
            // clear message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);
    
            // prevent showing again on refresh
            window.history.replaceState({}, document.title);
        }
        
    }, [location.state]);

    const deleteEmployee = (id) => {
        if (!window.confirm('Are you sure you want to delete this employee?')) return;
        
        EmployeeService.deleteEmployee(id).then(() => {
          setEmployees(prev => prev.filter(e => e.id !== id));

          // Remove from filteredEmployees (IMPORTANT)
            setFilteredEmployees(prev => prev.filter(e => e.id !== id));

            // Show success message
            setSuccessMessage('Employee deleted successfully');

            // Auto hide message
            setTimeout(() => setSuccessMessage(''), 3000);
        });
    };      

    const addEmployee = () => {
        navigate('/add-employee');
    };

    const viewEmployee = (id) => {
        navigate(`/view-employee/${id}`);
    }

    const editEmployee = (id) => {
        navigate(`/update-employee/${id}`);
    }

    const handleFilter = (term) => {
        if (!term) {
            setFilteredEmployees(employees);
            return;
        }
    
        const lowerTerm = term.toLowerCase();
        const filtered = employees.filter(emp =>
            emp.firstName.toLowerCase().includes(lowerTerm) ||
            emp.lastName.toLowerCase().includes(lowerTerm) ||
            emp.emailId.toLowerCase().includes(lowerTerm) ||
            emp.jobTitle.toLowerCase().includes(lowerTerm)
        );
    
        setFilteredEmployees(filtered);
    };

    const sortEmployees = (key) => {
        let direction = 'asc';
    
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
    
        setSortConfig({ key, direction });
    
        const sorted = [...filteredEmployees].sort((a, b) => {
            let aValue = a[key];
            let bValue = b[key];
    
            // Handle dates
            if (key === 'joiningDate' || key === 'dateOfBirth') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }
    
            // Handle numbers (Salary)
            if (key === 'salary') {
                aValue = Number(aValue);
                bValue = Number(bValue);
            }
    
            if (aValue < bValue) return direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return direction === 'asc' ? 1 : -1;
            return 0;
        });
    
        setFilteredEmployees(sorted);
    };

    return (
        <div>
            <h2 className="text-center mt-2">Employee List</h2>
            {successMessage && (
                <div className="alert alert-success alert-dismissible fade show mt-2" role="alert">
                    {successMessage}
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setSuccessMessage('')}
                    ></button>
                </div>
            )}
            <div className="row">
                <input type="text" className="form-control" placeholder="Search by name, email or role"
                    style={{width: "250px", marginRight: "5px"}} value={searchTerm} onChange={(e) => {
                        setSearchTerm(e.target.value);
                        handleFilter(e.target.value);
                    }}
                />
                <button className="btn btn-primary" style={{marginBottom: "10px"}} onClick={addEmployee}>Add Employee</button>
            </div>
            <div className="row">        
                <table className="table table-striped table-bordered table-hover">
                    <thead className="table-primary">
                        <tr>
                            <th>ID</th>
                            <th onClick={() => sortEmployees('firstName')} style={{ cursor: 'pointer' }}>
                                First Name 
                                <span style={{ marginLeft: '5px', fontSize: '0.8em', color: '#666' }}>
                                    {sortConfig.key === 'firstName' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '⇅'}
                                </span>
                            </th>
                            <th onClick={() => sortEmployees('lastName')} style={{ cursor: 'pointer' }}>
                                Last Name
                                <span style={{ marginLeft: '5px', fontSize: '0.8em', color: '#666' }}>
                                    {sortConfig.key === 'lastName' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '⇅'}
                                </span>
                            </th>
                            <th>Date of Birth</th>
                            <th>Email</th>                            
                            <th>Contact Info</th>
                            <th>Address</th>
                            <th>Gender</th>
                            <th onClick={() => sortEmployees('joiningDate')} style={{ cursor: 'pointer' }}>
                                Joining Date
                                <span style={{ marginLeft: '5px', fontSize: '0.8em', color: '#666' }}>
                                    {sortConfig.key === 'joiningDate' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '⇅'}
                                </span>
                            </th>
                            <th onClick={() => sortEmployees('salary')} style={{ cursor: 'pointer' }}>
                                Salary
                                <span style={{ marginLeft: '5px', fontSize: '0.8em', color: '#666' }}>
                                    {sortConfig.key === 'salary' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '⇅'}
                                </span>
                            </th>
                            <th>Leave Day</th>                            
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            currentEmployees.map(employee => (                            
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
                                    <td>{Number(employee.salary).toLocaleString()} MMK</td>
                                    <td>{employee.leaveDay}</td>
                                    <td>{employee.jobTitle}</td>
                                    <td className="text-nowrap">
                                        <div className="d-flex gap-2 justify-content-center">
                                            <button className="btn btn-sm btn-outline-success mr-1" title="Update" onClick={() => editEmployee(employee.id)}>
                                                <i className="bi bi-pencil"></i>
                                            </button>

                                            <button className="btn btn-sm btn-outline-info mr-1" title="View" onClick={() => viewEmployee(employee.id)}>
                                                <i className="bi bi-eye"></i>
                                            </button>

                                            <button className="btn btn-sm btn-outline-danger" title="Delete" onClick={() => deleteEmployee(employee.id)}>
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            <div className="d-flex justify-content-center mt-3">
                {Array.from({ length: Math.ceil(filteredEmployees.length / employeesPerPage) }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline-primary'} mx-1`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    )
};

export default ListEmployeeComponent