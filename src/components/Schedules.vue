<template>
  <div>
    <h3>排班汇总</h3>
    <div class="container">
      <!-- Filters -->
      <div class="row mb-4">
        <div class="col-md-3">
          <label class="form-label">开始日期</label>
          <input
            type="date"
            class="form-control"
            v-model="filters.start_date"
            @change="fetchScheduleSummary"
          />
        </div>
        <div class="col-md-3">
          <label class="form-label">结束日期</label>
          <input
            type="date"
            class="form-control"
            v-model="filters.end_date"
            @change="fetchScheduleSummary"
          />
        </div>
        <div class="col-md-3">
          <label class="form-label">职位</label>
          <select
            class="form-control"
            v-model="filters.position"
            @change="fetchScheduleSummary"
          >
            <option value="">所有职位</option>
            <option
              v-for="position in availablePositions"
              :key="position.value"
              :value="position.value"
            >
              {{ position.label }}
            </option>
          </select>
        </div>
        <div class="col-md-3 d-flex align-items-end">
          <button class="btn btn-primary" @click="fetchScheduleSummary">
            <i class="bi bi-search me-2"></i>刷新
          </button>
        </div>
      </div>

      <div v-if="loading" class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <div v-if="!loading && scheduleData.length === 0" class="alert alert-warning">
        <i class="bi bi-calendar-x me-2"></i>
        No schedule data found for the selected filters.
      </div>

      <div v-if="!loading && scheduleData.length > 0">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5>总排班数: {{ totalSchedules }}</h5>
        </div>

        <div class="table-responsive">
          <table class="table table-striped table-bordered">
            <thead class="table-dark">
              <tr>
                <th class="text-center">班次时间 (每小时)</th>
                <th v-for="position in positionLabels" :key="position">{{ position }}</th>
              </tr>
            </thead>
              <tbody>
              <tr v-for="row in tableData" :key="row.datetime">
                <td><strong>{{ row.datetime }}</strong></td>
                <td v-for="position in availablePositions" :key="position.value" class="text-center">
                  <button
                    v-if="getStaffCount(row, position.value) > 0"
                    class="btn btn-outline-primary btn-sm staff-count-btn"
                    @click="navigateToDetails(row.datetime, position.value)"
                    :title="`View ${getStaffCount(row, position.value)} ${position.label} staff for ${row.datetime}`"
                  >
                    {{ getStaffCount(row, position.value) }}
                  </button>
                  <span v-else class="text-muted">0</span>
                </td>
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
  name: 'Schedules',
  data() {
    return {
      scheduleData: [],
      totalSchedules: 0,
      loading: false,
      error: null,
      filters: {
        start_date: '',
        end_date: '',
        position: ''
      },
      availablePositions: [],
      positionLabels: []
    }
  },
  computed: {
    tableData() {
      // Transform the API data into table rows
      return this.scheduleData.map(item => ({
        datetime: item.work_datetime,
        staffing: item.staffing
      }))
    }
  },
  methods: {
    async fetchScheduleSummary() {
      this.loading = true
      this.error = null

      try {
        const params = {}
        if (this.filters.start_date) params.start_date = this.filters.start_date
        if (this.filters.end_date) params.end_date = this.filters.end_date
        if (this.filters.position) params.position = this.filters.position

        const response = await ScheduleDataService.getScheduleSummary(params)
        this.scheduleData = response.data.hourly_staffing_by_position || []
        this.totalSchedules = response.data.total_schedules || 0

      } catch (err) {
        this.error = 'Failed to fetch schedule summary'
        this.scheduleData = []
        this.totalSchedules = 0
      } finally {
        this.loading = false
      }
    },

    getStaffCount(row, position) {
      const staffing = row.staffing.find(s => s.position === position)
      return staffing ? staffing.work_count : 0
    },

    setDefaultDates() {
      const today = new Date()

      this.filters.start_date = today.toISOString().split('T')[0]
      this.filters.end_date = today.toISOString().split('T')[0]
    },

    loadJobPositions() {
      this.availablePositions = EmployeeDataService.getJobPositions()
      this.positionLabels = this.availablePositions.map(pos => pos.label)
    },

    navigateToDetails(datetime, position) {
      this.$router.push({
        path: '/schedule/details',
        query: {
          datetime: datetime,
          position: position
        }
      })
    }
  },

  async created() {
    this.loadJobPositions()
    this.setDefaultDates()
    await this.fetchScheduleSummary()
  }
}
</script>

<style scoped>
.table {
  font-size: 0.9rem;
}

.table th {
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
}

.table td {
  vertical-align: middle;
}

.table td:first-child {
  font-weight: 600;
  white-space: nowrap;
  background-color: #343a40;
  color: #ffffff;
  border-right: 2px solid #495057;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

.table-responsive {
  max-height: 70vh;
  overflow-y: auto;
}

.staff-count-btn {
  min-width: 35px;
  font-weight: 600;
  transition: all 0.2s ease;
  border-radius: 4px;
}

.staff-count-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 4px rgba(0,123,255,0.3);
}

.text-muted {
  font-size: 0.9rem;
}
</style>
