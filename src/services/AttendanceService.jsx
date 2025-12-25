import axios from 'axios';
// const ATTENDANCE_API_BASE_URL = "https://employee-management-system-4oo9.onrender.com/api/attendance";
const ATTENDANCE_API_BASE_URL = "http://localhost:8081/api/attendance";
// const ATTENDANCE_API_BASE_URL = "http://13.61.161.105/api/attendance";
class AttendanceService{
    getAttendance(){
        return axios.get(ATTENDANCE_API_BASE_URL);
    }
}
export default new AttendanceService();