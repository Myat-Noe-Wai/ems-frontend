import axios from 'axios';
const ROLE_API_BASE_URL = "https://employee-management-system-4oo9.onrender.com/api/roles";
// const ROLE_API_BASE_URL = "http://localhost:8080/api/roles";
class RoleService{
    getRoles(){
        return axios.get(ROLE_API_BASE_URL);
    }
    
    getRoleById(id){
        return axios.get(ROLE_API_BASE_URL + '/' + id);
    }

    createRole(role){
        return axios.post(ROLE_API_BASE_URL, role);
    }

    deleteRole(roleId) {
        return axios.delete(ROLE_API_BASE_URL + '/' + roleId);
    }

    updateRole(role, roleId){
        return axios.put(ROLE_API_BASE_URL + '/' + roleId, role);
    }
}
export default new RoleService();