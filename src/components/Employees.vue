<template>
  <div class="container">
    <h3>All Employees</h3>
    <div v-if="message" class="alert alert-success">{{ this.message }}</div>
    <div class="container">
      <table class="table table-striped table-bordered">
        <thead class="table-dark">
          <tr>
            <th>No.</th>
            <th>Full Name</th>
            <th>Age</th>
            <th>Position</th>
            <th>Actions</th>
            <th>Schedule</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(employee, index) in employees" v-bind:key="employee.id">
            <td>{{ index + 1 }}</td>
            <td>{{ employee.full_name }}</td>
            <td>{{ employee.age }}</td>
            <td>{{ employee.position }}</td>
            <td>
              <button class="btn btn-danger btn-sm" v-on:click="deleteEmployee(employee.id)" title="Delete">
                <i class="bi bi-trash"></i>
              </button>
            </td>
            <td>
              <button class="btn btn-primary btn-sm me-2" v-on:click="editSchedule(employee.id)" title="Add Schedule">
                <i class="bi bi-calendar-plus"></i>
              </button>
              <button class="btn btn-info btn-sm" v-on:click="viewSchedule(employee.id)" title="View Schedule">
                <i class="bi bi-eye"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="row">
        <button class="btn btn-success" v-on:click="addEmployee()">
          <i class="bi bi-plus-circle me-2"></i>Add Employee
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import EmployeeDataService from '../services/EmployeeDataService'

export default {
  name: 'EmployeesList',
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
    editSchedule(id) {
      this.$router.push(`/employee/${id}/schedule/add`)
    },
    viewSchedule(id) {
      this.$router.push(`/employee/${id}/schedule`)
    },
  },
  created() {
    this.refreshEmployees()
  },
}
</script>
