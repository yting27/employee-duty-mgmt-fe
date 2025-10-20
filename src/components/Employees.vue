<template>
  <div class="container">
    <h3>{{ $t('all_employees') }}</h3>
    <div v-if="message" class="alert alert-success">{{ this.message }}</div>
    <div class="container">
      <table class="table table-striped table-bordered">
        <thead class="table-dark">
          <tr>
            <th>{{ $t('employee_no') }}</th>
            <th>{{ $t('full_name') }}</th>
            <th>{{ $t('age') }}</th>
            <th>{{ $t('position') }}</th>
            <th>{{ $t('actions') }}</th>
            <th>{{ $t('schedule') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(employee, index) in employees" v-bind:key="employee.id">
            <td>{{ index + 1 }}</td>
            <td>{{ employee.full_name }}</td>
            <td>{{ employee.age }}</td>
            <td>{{ getPositionLabel(employee.position) }}</td>
            <td>
              <button
                class="btn btn-danger btn-sm"
                v-on:click="deleteEmployee(employee.id)"
                title="Delete"
              >
                <i class="bi bi-trash"></i>
              </button>
            </td>
            <td>
              <button
                class="btn btn-primary btn-sm me-2"
                v-on:click="addSchedule(employee.id)"
                title="Add Schedule"
              >
                <i class="bi bi-calendar-plus"></i>
              </button>
              <button
                class="btn btn-info btn-sm"
                v-on:click="viewSchedule(employee.id)"
                title="View Schedule"
              >
                <i class="bi bi-eye"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="row">
        <button class="btn btn-primary" v-on:click="addEmployee()">
          <i class="bi bi-plus-circle me-2"></i>{{ $t('add_employee') }}
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import EmployeeDataService from '../services/EmployeeDataService'
import LanguageMixin from '../mixins/LanguageMixin'

export default {
  name: 'EmployeesList',
  mixins: [LanguageMixin],
  data() {
    return {
      employees: [],
      message: '',
    }
  },
  methods: {
    refreshEmployees() {
      EmployeeDataService.retrieveAllEmployees().then((res) => {
        this.employees = res.data.data
      })
    },

    addEmployee() {
      this.$router.push(`/employee/-1`)
    },

    deleteEmployee(id) {
      // TODO: create confirmation popup later
      if (confirm('Are you sure you want to delete this employee?')) {
        EmployeeDataService.deleteEmployee(id).then(() => {
          this.refreshEmployees()
        })
      }
    },

    addSchedule(id) {
      this.$router.push(`/employee/${id}/schedule/add`)
    },

    viewSchedule(id) {
      this.$router.push(`/employee/${id}/schedule`)
    },

    getPositionLabel(position) {
      return this.$t('position.' + position) || position
    },
  },
  created() {
    this.refreshEmployees()
  },
}
</script>
