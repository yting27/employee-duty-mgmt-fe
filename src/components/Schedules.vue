<template>
  <div>
    <h3>{{ $t('schedule.summary') }}</h3>
    <div class="container">
      <!-- Filters -->
      <div class="row mb-4">
        <div class="col-md-3">
          <label class="form-label">{{ $t('schedule.startDate') }}</label>
          <input
            type="date"
            class="form-control"
            v-model="filters.start_date"
            @change="fetchScheduleSummary"
          />
        </div>
        <div class="col-md-3">
          <label class="form-label">{{ $t('schedule.endDate') }}</label>
          <input
            type="date"
            class="form-control"
            v-model="filters.end_date"
            @change="fetchScheduleSummary"
          />
        </div>
        <div class="col-md-3">
          <label class="form-label">{{ $t('employee.position') }}</label>
          <MultiSelectDropdown
            v-model="filters.positions"
            :options="availablePositions"
            :placeholder="$t('schedule.allPositions')"
            @change="fetchScheduleSummary"
          />
        </div>
        <div class="col-md-3 d-flex align-items-end">
          <button class="btn btn-primary" @click="fetchScheduleSummary">
            <i class="bi bi-search me-2"></i>{{ $t('common.refresh') }}
          </button>
        </div>
      </div>

      <div v-if="loading" class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">{{ $t('common.loading') }}</span>
        </div>
      </div>

      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <div v-if="!loading && scheduleData.length === 0" class="alert alert-warning">
        <i class="bi bi-calendar-x me-2"></i>
        {{ $t('schedule.noDataFound') }}
      </div>

      <div v-if="!loading && scheduleData.length > 0">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5>{{ $t('schedule.totalSchedules') }}: {{ totalSchedules }}</h5>
        </div>

        <div class="table-responsive">
          <table class="table table-striped table-bordered">
            <thead class="table-dark">
              <tr>
                <th class="text-center">{{ $t('schedule.shiftTime') }}</th>
                <th v-for="position in filteredPositions" :key="position.value">{{ position.label }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in tableData" :key="row.datetime">
                <td>
                  <strong>{{ row.datetime }}</strong>
                </td>
                <td
                  v-for="position in filteredPositions"
                  :key="position.value"
                  class="text-center"
                >
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
import LanguageMixin from '../mixins/LanguageMixin'
import MultiSelectDropdown from './MultiSelectDropdown.vue'

export default {
  name: 'Schedules',
  mixins: [LanguageMixin],
  components: {
    MultiSelectDropdown
  },
  data() {
    return {
      scheduleData: [],
      totalSchedules: 0,
      loading: false,
      error: null,
      filters: {
        start_date: '',
        end_date: '',
        positions: [], // Changed to array for multi-select
      },
      availablePositions: [],
      positionLabels: [],
    }
  },
  computed: {
    tableData() {
      // Transform the API data into table rows
      return this.scheduleData.map((item) => ({
        datetime: item.work_datetime,
        staffing: item.staffing,
      }))
    },
    filteredPositions() {
      // If positions are selected, show only those; otherwise show all
      if (this.filters.positions && this.filters.positions.length > 0) {
        return this.availablePositions.filter(pos =>
          this.filters.positions.includes(pos.value)
        )
      }
      return this.availablePositions
    },
  },
  methods: {
    async fetchScheduleSummary() {
      this.loading = true
      this.error = null

      try {
        const params = {}
        if (this.filters.start_date) params.start_date = this.filters.start_date
        if (this.filters.end_date) params.end_date = this.filters.end_date

        const response = await ScheduleDataService.getScheduleSummary(params)
        this.scheduleData = response.data.hourly_staffing_by_position || []
        this.totalSchedules = response.data.total_schedules || 0
      } catch {
        this.error = 'Failed to fetch schedule summary'
        this.scheduleData = []
        this.totalSchedules = 0
      } finally {
        this.loading = false
      }
    },

    getStaffCount(row, position) {
      const staffing = row.staffing.find((s) => s.position === position)
      return staffing ? staffing.work_count : 0
    },

    setDefaultDates() {
      const today = new Date()

      this.filters.start_date = today.toISOString().split('T')[0]
      this.filters.end_date = today.toISOString().split('T')[0]
    },

    loadJobPositions() {
      this.availablePositions = this.getJobPositions()
      this.positionLabels = this.availablePositions.map((pos) => this.$t(`position.${pos.value}`))
    },

    navigateToDetails(datetime, position) {
      this.$router.push({
        path: '/schedule/details',
        query: {
          datetime: datetime,
          position: position,
        },
      })
    },
  },

  async created() {
    this.loadJobPositions()
    this.setDefaultDates()
    await this.fetchScheduleSummary()
  },
}
</script>

<style scoped>
.staff-count-btn {
  min-width: 35px;
  font-weight: 600;
  transition: all 0.2s ease;
  border-radius: 4px;
}

.staff-count-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 4px rgba(0, 123, 255, 0.3);
}

.text-muted {
  font-size: 0.9rem;
}
</style>

