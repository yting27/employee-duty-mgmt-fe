<template>
  <div>
    <h3>{{ $t('add_employee_schedule') }}</h3>
    <div class="container">
      <div v-if="employee" class="alert alert-info">
        <i class="bi bi-person-circle me-2"></i>
        {{ $t('adding_schedule_for') }} <strong>{{ employee.full_name }}</strong> ({{
          getPositionLabel(employee.position)
        }})
      </div>

      <form @submit="validateAndSubmit">
        <div v-if="errors.length">
          <div class="alert alert-danger" v-bind:key="index" v-for="(error, index) in errors">
            {{ error }}
          </div>
        </div>

        <div v-if="message" class="alert alert-success">
          {{ message }}
        </div>

        <div class="row">
          <div class="col-md-6">
            <fieldset class="form-group">
              <label>{{ $t('start_date') }}</label>
              <input type="date" class="form-control" v-model="start_date" required />
            </fieldset>
          </div>
          <div class="col-md-6">
            <fieldset class="form-group">
              <label>{{ $t('end_date') }}</label>
              <input type="date" class="form-control" v-model="end_date" required />
            </fieldset>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <fieldset class="form-group">
              <label>{{ $t('start_time') }}</label>
              <input type="time" class="form-control" v-model="start_time" required />
            </fieldset>
          </div>
          <div class="col-md-6">
            <fieldset class="form-group">
              <label>{{ $t('end_time') }}</label>
              <input type="time" class="form-control" v-model="end_time" required />
            </fieldset>
          </div>
        </div>

        <div class="mt-3">
          <button class="btn btn-success me-2" type="submit">
            <i class="bi bi-calendar-check me-2"></i>{{ $t('save_schedule') }}
          </button>
          <button class="btn btn-secondary" type="button" @click="goBack">
            <i class="bi bi-arrow-left me-2"></i>{{ $t('back') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import EmployeeDataService from '../services/EmployeeDataService'
import ScheduleDataService from '../services/ScheduleDataService'
import LanguageMixin from '../mixins/LanguageMixin'

export default {
  name: 'ScheduleCreate',
  mixins: [LanguageMixin],
  data() {
    return {
      employee: null,
      start_date: '',
      end_date: '',
      start_time: '',
      end_time: '',
      errors: [],
      message: '',
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
      } catch (error) {
        this.errors.push('Failed to fetch employee details')
      }
    },

    validateAndSubmit(e) {
      e.preventDefault()
      this.errors = []
      this.message = ''

      // Validation
      if (!this.start_date) {
        this.errors.push('Start date is required')
      }

      if (!this.end_date) {
        this.errors.push('End date is required')
      }

      if (!this.start_time) {
        this.errors.push('Start time is required')
      }

      if (!this.end_time) {
        this.errors.push('End time is required')
      }

      // Date validation
      if (this.start_date && this.end_date && new Date(this.start_date) > new Date(this.end_date)) {
        this.errors.push('Start date cannot be after end date')
      }

      // Time validation for same day
      if (
        this.start_date === this.end_date &&
        this.start_time &&
        this.end_time &&
        this.start_time >= this.end_time
      ) {
        this.errors.push('Start time must be before end time on the same day')
      }

      if (this.errors.length === 0) {
        this.saveSchedule()
      }
    },

    async saveSchedule() {
      try {
        // Format the data according to the API structure
        const scheduleData = {
          start_date: this.start_date,
          end_date: this.end_date,
          start_time: this.formatTimeToISO(this.start_time),
          end_time: this.formatTimeToISO(this.end_time),
          employee_id: this.employeeId,
        }

        // Use the ScheduleDataService
        await ScheduleDataService.createSchedule(scheduleData)
        // Clear form after successful save
        this.start_date = ''
        this.end_date = ''
        this.start_time = ''
        this.end_time = ''
        // Notify user of successful save
        this.message = 'Schedule saved successfully!'
        this.goBack()
      } catch (err) {
        if (err.response && err.response.data && err.response.data.detail) {
          this.errors.push(err.response.data.detail)
        } else {
          this.errors.push('Network error: Failed to save schedule')
        }
      }
    },

    formatTimeToISO(timeString) {
      // Convert HH:MM to ISO format
      return `${timeString}:00.000Z`
    },

    setDefaultTimes() {
      // Set default working hours if not already set
      if (!this.start_time) {
        this.start_time = '09:00'
      }
      if (!this.end_time) {
        this.end_time = '17:00'
      }
    },

    getPositionLabel(position) {
      return this.$t('position.' + position) || position
    },

    goBack() {
      // Go back to previous page (one level back)
      this.$router.go(-1)
    },
  },

  async created() {
    await this.fetchEmployeeDetails()
    this.setDefaultTimes()

    // Set default dates to today
    const today = new Date().toISOString().split('T')[0]
    this.start_date = today
    this.end_date = today
  },
}
</script>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}
</style>
