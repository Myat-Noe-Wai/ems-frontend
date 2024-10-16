import axios from 'axios';
const ATTENDANCE_API_BASE_URL = "http://localhost:8080/api/attendance";
class AttendanceService{
    getAttendance(){
        return axios.get(ATTENDANCE_API_BASE_URL);
    }
}
export default new AttendanceService();