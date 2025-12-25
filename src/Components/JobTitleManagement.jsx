import React, { useState, useEffect } from 'react';
import JobTitleService from '../services/JobTitleService';
import { useNavigate } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';

function JobTitleManagement() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [name, setRoleName] = useState('');
  const [description, setRoleDescription] = useState('');
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    JobTitleService.getRoles().then((res) => {
      if (Array.isArray(res.data)) {
        setRoles(res.data);
      } else {
        setRoles([]);
      }
    }).catch(err => {
      console.error("Error fetching roles: ", err);
      setRoles([]);
    });
  }, []);

  const handleRoleNameChange = (e) => setRoleName(e.target.value);
  const handleRoleDescriptionChange = (e) => setRoleDescription(e.target.value);

  const saveRole = (e) => {
    e.preventDefault();
    let role = { name, description };

    if (editingRoleId) {
      JobTitleService.updateRole(role, editingRoleId).then(res => {
        console.log('role => ' + JSON.stringify(role));
        JobTitleService.getRoles().then((res) => {
          if (Array.isArray(res.data)) {
            setRoles(res.data);
          } else {
            setRoles([]);
          }
        }).catch(err => {
          console.error("Error fetching roles: ", err);
          setRoles([]);
        });
        setRoleName('');
        setRoleDescription('');
        setEditingRoleId(null);
        setShowModal(false);
      }).catch(err => {
        console.error("Error updating role: ", err);
      });
    } else {
      JobTitleService.createRole(role).then(res => {
        JobTitleService.getRoles().then((res) => {
          if (Array.isArray(res.data)) {
            setRoles(res.data);
          } else {
            setRoles([]);
          }
        }).catch(err => {
          console.error("Error fetching roles: ", err);
          setRoles([]);
        });
        setRoleName('');
        setRoleDescription('');
      }).catch(err => {
        console.error("Error saving role: ", err);
      });
    }
  };

  const handleDelete = async (id) => {
    JobTitleService.deleteRole(id).then((res) => {
      setRoles(roles.filter(role => role.id !== id));
    }).catch(error => {
      console.error("There was an error deleting the role!", error);
    });
  };

  const handleEdit = (role) => {
    setRoleName(role.name);
    setRoleDescription(role.description);
    setEditingRoleId(role.id);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setRoleName('');
    setRoleDescription('');
    setEditingRoleId(null);
  };

  return (
    <div>
      <h2 className="text-center" style={{ marginTop: "10px"}}>Job Title Management</h2>
      <div className="row" style={{ marginTop: "25px", marginBottom: "10px", marginLeft: "2px" }}>
        <input type="text" className="form-control" style={{ width: "20%", marginRight: "10px" }} value={name} onChange={handleRoleNameChange} placeholder="Job Title" required />
        <input type="text" className="form-control" style={{ width: "20%" }} value={description} onChange={handleRoleDescriptionChange} placeholder="Description" required />
        <button className="btn btn-primary" style={{ marginLeft: "10px" }} onClick={saveRole}>{editingRoleId ? 'Update Role' : 'Add New JobTitle'}</button>
      </div>
      <table className="table table-striped table-bordered">
        <thead className="table-primary">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td>{role.id}</td>
              <td>{role.name}</td>
              <td>{role.description}</td>
              <td>
                <button className="btn btn-success" onClick={() => handleEdit(role)}>Edit</button>
                <button style={{ marginLeft: "10px" }} className="btn btn-danger" onClick={() => handleDelete(role.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{editingRoleId ? 'Edit Job Title' : 'Add Job Title'}</h5>
              <button type="button" className="close" onClick={handleClose} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label htmlFor="roleName">Job Title</label>
                  <input type="text" className="form-control" id="roleName" value={name} onChange={handleRoleNameChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="roleDescription">Description</label>
                  <input type="text" className="form-control" id="roleDescription" value={description} onChange={handleRoleDescriptionChange} />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
              <button type="button" className="btn btn-primary" onClick={saveRole}>{editingRoleId ? 'Save changes' : 'Add Role'}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobTitleManagement;
