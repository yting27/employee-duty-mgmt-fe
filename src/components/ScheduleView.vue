<template>
  <div>
    <h3>员工排班</h3>
    <div class="container">
      <div v-if="employee" class="alert alert-info">
        <i class="bi bi-person-circle me-2"></i>
        排班表: <strong>{{ employee.full_name }}</strong> ({{ employee.position }})
      </div>

      <div v-if="loading" class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <div v-if="!loading && schedules.length === 0" class="alert alert-warning">
        <i class="bi bi-calendar-x me-2"></i>
        该员工暂无排班记录。
      </div>

      <div v-if="!loading && schedules.length > 0">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5>排班详情 (共 {{ schedules.length }} 条记录)</h5>
          <button class="btn btn-primary" @click="addSchedule">
            <i class="bi bi-plus-circle me-2"></i>添加新排班
          </button>
        </div>

        <table class="table table-striped table-bordered">
          <thead class="table-dark">
            <tr>
              <th>开始日期</th>
              <th>结束日期</th>
              <th>开始时间</th>
              <th>结束时间</th>
              <th>工作时长</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(schedule, index) in schedules" :key="schedule.id">
              <td>{{ formatDate(schedule.start_date) }}</td>
              <td>{{ formatDate(schedule.end_date) }}</td>
              <td>{{ formatTime(schedule.start_time) }}</td>
              <td>{{ formatTime(schedule.end_time) }}</td>
              <td>{{ calculateDuration(schedule) }}</td>
              <td>
                <button
                  class="btn btn-danger btn-sm"
                  @click="deleteSchedule(schedule.id)"
                  title="Delete Schedule"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-3">
        <button class="btn btn-secondary" @click="goBack">
          <i class="bi bi-arrow-left me-2"></i>返回
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import EmployeeDataService from '../services/EmployeeDataService'
import ScheduleDataService from '../services/ScheduleDataService'

export default {
  name: 'ScheduleView',
  data() {
    return {
      employee: null,
      schedules: [],
      loading: false,
      error: null,
    }
  },
  computed: {
    employeeId() {
      return this.$route.params.id
    },
  },
  methods: {
    async fetchEmployeeDetails() {
      try {
        const response = await EmployeeDataService.retrieveEmployee(this.employeeId)
        this.employee = response.data
      } catch (err) {
        this.error = 'Failed to fetch employee details'
      }
    },

    async fetchEmployeeSchedules() {
      this.loading = true
      this.error = null

      try {
        // Use the specific employee schedule endpoint
        const response = await ScheduleDataService.getEmployeeSchedules(this.employeeId)
        this.schedules = response.data.data || []
      } catch (err) {
        this.error = 'Failed to fetch employee schedules'
        this.schedules = []
      } finally {
        this.loading = false
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },

    formatTime(timeString) {
      // Handle time format like "16:06:00"
      return timeString.slice(0, 5) // Returns "16:06"
    },

    calculateDuration(schedule) {
      const startTime = this.parseTimeToMinutes(schedule.start_time)
      const endTime = this.parseTimeToMinutes(schedule.end_time)

      let durationMinutes

      if (endTime >= startTime) {
        // Normal shift (same day)
        durationMinutes = endTime - startTime
      } else {
        // Overnight shift (crosses midnight)
        durationMinutes = (24 * 60) - startTime + endTime
      }

      // Convert to hours and minutes
      const hours = Math.floor(durationMinutes / 60)
      const minutes = durationMinutes % 60

      if (minutes === 0) {
        return `${hours}h`
      } else {
        return `${hours}h ${minutes}m`
      }
    },

    parseTimeToMinutes(timeString) {
      const [hours, minutes] = timeString.split(':').map(Number)
      return hours * 60 + minutes
    },

    async deleteSchedule(scheduleId) {
      if (confirm('Are you sure you want to delete this schedule?')) {
        try {
          await ScheduleDataService.deleteSchedule(scheduleId)
          // Refresh the schedule list
          await this.fetchEmployeeSchedules()
        } catch (err) {
          this.error = 'Failed to delete schedule'
        }
      }
    },

    addSchedule() {
      this.$router.push(`/employee/${this.employeeId}/schedule/add`)
    },

    goBack() {
      // Go back to previous page (one level back)
      this.$router.go(-1)
    }
  },

  async created() {
    await this.fetchEmployeeDetails()
    await this.fetchEmployeeSchedules()
  },
}
</script>
