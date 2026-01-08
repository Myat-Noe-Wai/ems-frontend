import api from "../api/axiosConfig";

const ROLE_API_BASE_URL = "/jobTitles";

class JobTitleService {

  getRoles() {
    return api.get(ROLE_API_BASE_URL);
  }

  getRoleById(id) {
    return api.get(`${ROLE_API_BASE_URL}/${id}`);
  }

  createRole(role) {
    return api.post(ROLE_API_BASE_URL, role);
  }

  updateRole(role, roleId) {
    return api.put(`${ROLE_API_BASE_URL}/${roleId}`, role);
  }

  deleteRole(roleId) {
    return api.delete(`${ROLE_API_BASE_URL}/${roleId}`);
  }
}

export default new JobTitleService();
