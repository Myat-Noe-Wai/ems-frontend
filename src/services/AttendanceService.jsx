import axios from 'axios';
const ATTENDANCE_API_BASE_URL = "https://employee-management-system-4oo9.onrender.com/api/attendance";
class AttendanceService{
    getAttendance(){
        return axios.get(ATTENDANCE_API_BASE_URL);
    }
}
export default new AttendanceService();