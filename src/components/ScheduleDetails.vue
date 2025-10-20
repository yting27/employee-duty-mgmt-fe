<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h3>{{ getPositionLabel(queryParams.position) }} 排班详情</h3>
        <p class="text-muted mb-0" v-if="queryParams.datetime && queryParams.position">
          <i class="bi bi-clock me-2"></i>工作时间: {{ queryParams.datetime }}
        </p>
      </div>
      <button class="btn btn-secondary" @click="goBack">
        <i class="bi bi-arrow-left me-2"></i>返回排班表
      </button>
    </div>

    <div class="container">

      <div v-if="loading" class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <div v-if="!loading && scheduleDetails.length === 0" class="alert alert-warning">
        <i class="bi bi-calendar-x me-2"></i>
        所选时间段内未找到员工。
      </div>

      <div v-if="!loading && scheduleDetails.length > 0">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5>员工总数: {{ totalEmployees }}</h5>
        </div>

        <div class="table-responsive">
          <table class="table table-striped table-bordered">
            <thead class="table-dark">
              <tr>
                <th>员工姓名</th>
                <th>开始日期</th>
                <th>结束日期</th>
                <th>开始时间</th>
                <th>结束时间</th>
                <th>工作时长</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in scheduleDetails" :key="item.schedule.id">
                <td>
                  <i class="bi bi-person-fill me-2"></i>
                  {{ item.employee.full_name }}
                </td>
                <td>{{ formatDate(item.schedule.start_date) }}</td>
                <td>{{ formatDate(item.schedule.end_date) }}</td>
                <td>{{ formatTime(item.schedule.start_time) }}</td>
                <td>{{ formatTime(item.schedule.end_time) }}</td>
                <td>{{ calculateDuration(item.schedule.start_date, item.schedule.start_time, item.schedule.end_date, item.schedule.end_time) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ScheduleDataService from '../services/ScheduleDataService'
import EmployeeDataService from '../services/EmployeeDataService'

export default {
  name: 'ScheduleDetails',
  data() {
    return {
      scheduleDetails: [],
      totalEmployees: 0,
      loading: false,
      error: null,
      availablePositions: [],
      queryParams: {}
    }
  },
  methods: {
    async fetchScheduleDetails() {
      this.loading = true
      this.error = null

      try {
        const params = {}
        if (this.queryParams.datetime) {
          // Parse datetime format "2025-10-20 09:00"
          const [datePart, timePart] = this.queryParams.datetime.split(' ')
          if (datePart && timePart) {
            // Set start date and time
            params.start_date = datePart
            params.start_time = timePart

            // Calculate end time (start time + 1 hour)
            const startDateTime = new Date(`${datePart}T${timePart}:00`)
            const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000) // Add 1 hour in milliseconds

            params.end_date = endDateTime.toISOString().split('T')[0]
            params.end_time = endDateTime.toTimeString().substring(0, 5)
          }
        }
        if (this.queryParams.position) params.position = this.queryParams.position

        const response = await ScheduleDataService.getSchedules(params)
        this.scheduleDetails = response.data.data.map(item => ({
          schedule: item[0],
          employee: item[1]
        }))

        this.totalEmployees = response.data.count || 0

      } catch (error) {
        console.error('Error fetching schedule details:', error)
        this.error = 'Failed to fetch schedule details'
        this.scheduleDetails = []
        this.totalEmployees = 0
      } finally {
        this.loading = false
      }
    },

    formatTime(timeString) {
      if (!timeString) return ''
      const time = timeString.substring(0, 5)
      return time
    },

    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString()
    },

    calculateDuration(startDate, startTime, endDate, endTime) {
      if (!startDate || !startTime || !endDate || !endTime) return ''

      const start = new Date(`${startDate}T${startTime}`)
      const end = new Date(`${endDate}T${endTime}`)

      // Handle overnight shifts
      if (end < start) {
        end.setDate(end.getDate() + 1)
      }

      const diffMs = end - start
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

      return `${diffHours}h ${diffMinutes}m`
    },

    getPositionLabel(position) {
      const pos = this.availablePositions.find(p => p.value === position)
      return pos ? pos.label : position
    },

    loadJobPositions() {
      this.availablePositions = EmployeeDataService.getJobPositions()
    },

    parseQueryParams() {
      this.queryParams = { ...this.$route.query }
    },

    goBack() {
      this.$router.go(-1)
    }
  },

  async created() {
    this.loadJobPositions()
    this.parseQueryParams()
    await this.fetchScheduleDetails()
  }
}
</script>
