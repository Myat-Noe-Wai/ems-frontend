import React, { useState, useEffect } from 'react';
import JobTitleService from '../services/JobTitleService';
import { useNavigate } from 'react-router-dom';

function JobTitleManagement() {
  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);
  const [name, setRoleName] = useState('');
  const [description, setRoleDescription] = useState('');
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleRoleNameChange = (e) => setRoleName(e.target.value);
  const handleRoleDescriptionChange = (e) => setRoleDescription(e.target.value);

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = 'Job title is required';
    if (!description.trim()) newErrors.description = 'Description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveRole = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const role = { name, description };

    if (editingRoleId) {
      JobTitleService.updateRole(role, editingRoleId).then(() => {
        setSuccessMessage('Job title updated successfully');
        setShowSuccessModal(true);
        fetchRoles();
        resetForm();
      });
    } else {
      JobTitleService.createRole(role).then(() => {
        setSuccessMessage('Job title added successfully');
        setShowSuccessModal(true);
        fetchRoles();
        resetForm();
      });
    }
  };

  const fetchRoles = () => {
    JobTitleService.getRoles().then((res) => {
      setRoles(Array.isArray(res.data) ? res.data : []);
    });
  };

  const resetForm = () => {
    setRoleName('');
    setRoleDescription('');
    setEditingRoleId(null);
    setErrors({});
    setShowModal(false);
  };

  const handleEdit = (role) => {
    setRoleName(role.name);
    setRoleDescription(role.description);
    setEditingRoleId(role.id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    JobTitleService.deleteRole(id).then(() => {
      setRoles(roles.filter(role => role.id !== id));
    });
  };

  return (
    <div>
      {/* ✅ HORIZONTAL FORM */}
      <div className="d-flex align-items-start mt-4 mb-3 gap-3">

        {/* Job Title */}
        <div style={{ width: '220px', marginRight: '5px' }}>
          <input
            type="text"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            value={name}
            onChange={handleRoleNameChange}
            placeholder="Job Title"
          />
          {errors.name && (
            <div className="text-danger small mt-1">
              {errors.name}
            </div>
          )}
        </div>

        {/* Description */}
        <div style={{ width: '220px', marginRight: '5px' }}>
          <input
            type="text"
            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
            value={description}
            onChange={handleRoleDescriptionChange}
            placeholder="Description"
          />
          {errors.description && (
            <div className="text-danger small mt-1">
              {errors.description}
            </div>
          )}
        </div>

        {/* Button */}
        <button
          className="btn btn-primary"
          style={{ height: '38px' }}
          onClick={saveRole}
        >
          {editingRoleId ? 'Update JobTitle' : 'Add New JobTitle'}
        </button>

      </div>

      {/* TABLE */}
      <table className="table table-striped table-bordered table-hover">
        <thead className="table-primary">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map(role => (
            <tr key={role.id}>
              <td>{role.id}</td>
              <td>{role.name}</td>
              <td>{role.description}</td>
              <td>
                <button className="btn btn-success mr-2" onClick={() => handleEdit(role)}>
                  Edit
                </button>
                <button
                  className="btn btn-danger ms-2"
                  onClick={() => handleDelete(role.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* SUCCESS MODAL */}
      <div
        className={`modal fade ${showSuccessModal ? 'show' : ''}`}
        style={{ display: showSuccessModal ? 'block' : 'none' }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-success text-white">
              <h5 className="modal-title">Success</h5>
              <button className="close" onClick={() => setShowSuccessModal(false)}>
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body text-center">
              {successMessage}
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-success"
                onClick={() => setShowSuccessModal(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default JobTitleManagement;
