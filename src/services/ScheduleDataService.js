import axios from 'axios'
import { BACKEND_URL } from '../config'

class ScheduleDataService {

  createSchedule(scheduleData) {
    return axios.post(`${BACKEND_URL}/schedule/`, scheduleData)
  }

  retrieveAllSchedules(params = {}) {
    return axios.get(`${BACKEND_URL}/schedule/`, { params })
  }

  updateSchedule(scheduleId, scheduleData) {
    return axios.patch(`${BACKEND_URL}/schedule/${scheduleId}`, scheduleData)
  }

  deleteSchedule(scheduleId) {
    return axios.delete(`${BACKEND_URL}/schedule/${scheduleId}`)
  }

  // Helper method to get schedules with filtering
  getSchedulesWithFilter(startDate, endDate, position, startTime, endTime) {
    const params = {}
    if (startDate) params.start_date = startDate
    if (endDate) params.end_date = endDate
    if (position) params.position = position
    if (startTime) params.start_time = startTime
    if (endTime) params.end_time = endTime

    return this.retrieveAllSchedules(params)
  }

  getEmployeeSchedules(employeeId, skip = 0, limit = 100, params = {}) {
    const queryParams = { skip, limit, ...params }
    return axios.get(`${BACKEND_URL}/schedule/${employeeId}`, { params: queryParams })
  }

  getScheduleSummary(params = {}) {
    const queryParams = { skip: 0, limit: 100, ...params }
    return axios.get(`${BACKEND_URL}/schedule/summary`, { params: queryParams })
  }

  getSchedules(params = {}) {
    const queryParams = { skip: 0, limit: 100, ...params }
    console.log('Fetching schedules with params:', queryParams)
    return axios.get(`${BACKEND_URL}/schedule/`, { params: queryParams })
  }

  getJobPositions() {
    return [
      { value: 'DRIVER', label: 'Driver' },
      { value: 'CHEF', label: 'Chef' },
      { value: 'WAITER', label: 'Waiter' },
      { value: 'MANAGER', label: 'Manager' },
      { value: 'CLEANER', label: 'Cleaner' },
      { value: 'OPERATOR', label: 'Operator' },
      { value: 'TECHNICIAN', label: 'Technician' },
      { value: 'CUSTOMER_SERVICE', label: 'Customer Service' },
      { value: 'SECURITY_GUARD', label: 'Security Guard' },
    ]
  }

}

export default new ScheduleDataService()