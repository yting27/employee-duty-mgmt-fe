import axios from 'axios'
import { BACKEND_URL } from '../config'

class EmployeeDataService {

    retrieveAllEmployees() {
        return axios.get(`${BACKEND_URL}/employee`);
    }

    retrieveEmployee(id) {
        return axios.get(`${BACKEND_URL}/employee/${id}`);
    }

    deleteEmployee(id) {
        return axios.delete(`${BACKEND_URL}/employee/${id}`);
    }

    updateEmployee(id, employee) {
        return axios.put(`${BACKEND_URL}/employee/${id}`, employee);
    }

    createEmployee(employee) {
        return axios.post(`${BACKEND_URL}/employee`, employee);
    }
}

export default new EmployeeDataService()