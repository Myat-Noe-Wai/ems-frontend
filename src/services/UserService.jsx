import api from '../api/axiosConfig';

const USER_API_BASE_URL = `/v1/user/all`;

class UserService {
    getUsers() {
        return api.get(USER_API_BASE_URL); // Returns list of users
    }
}

export default new UserService();
