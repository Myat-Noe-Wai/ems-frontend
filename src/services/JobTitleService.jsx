import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const ROLE_API_BASE_URL = `${API_BASE_URL}/jobTitles`;
class JobTitleService{
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
export default new JobTitleService();