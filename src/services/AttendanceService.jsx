import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const ATTENDANCE_API_BASE_URL = `${API_BASE_URL}/attendance`;
class AttendanceService{
    getAttendance(){
        return axios.get(ATTENDANCE_API_BASE_URL);
    }
}
export default new AttendanceService();