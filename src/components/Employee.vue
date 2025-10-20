<template>
  <div>
    <h3>Add Employee</h3>
    <div class="container">
      <form @submit="validateAndSubmit">
        <div v-if="errors.length">
          <div class="alert alert-danger" v-bind:key="index" v-for="(error, index) in errors">
            {{ error }}
          </div>
        </div>
        <div v-if="message" class="alert alert-success">
          {{ message }}
        </div>
        <fieldset class="form-group">
          <label>Full Name</label>
          <input type="text" class="form-control" v-model="full_name" />
        </fieldset>
        <fieldset class="form-group">
          <label>Age</label>
          <input type="number" class="form-control" v-model.number="age" />
        </fieldset>
        <fieldset class="form-group">
          <label>Position</label>
          <select class="form-control" v-model="position">
            <option value="">Select Position</option>
            <option v-for="pos in availablePositions" :key="pos.value" :value="pos.value">
              {{ pos.label }}
            </option>
          </select>
        </fieldset>

        <div class="mt-3">
          <button class="btn btn-success me-2" type="submit">
            <i class="bi bi-calendar-check me-2"></i>Save Employee
          </button>
          <button class="btn btn-secondary" type="button" @click="$router.push('/employees')">
            <i class="bi bi-arrow-left me-2"></i>Back
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import EmployeeDataService from '../services/EmployeeDataService'

export default {
  name: 'EmployeeDetails',
  data() {
    return {
      full_name: '',
      age: 18,
      position: '',
      errors: [],
      message: '',
      availablePositions: [
        { value: 'DRIVER', label: 'Driver' },
        { value: 'CHEF', label: 'Chef' },
        { value: 'WAITER', label: 'Waiter' },
        { value: 'MANAGER', label: 'Manager' },
        { value: 'CLEANER', label: 'Cleaner' },
        { value: 'OPERATOR', label: 'Operator' },
        { value: 'TECHNICIAN', label: 'Technician' },
        { value: 'CUSTOMER_SERVICE', label: 'Customer Service' },
        { value: 'SECURITY_GUARD', label: 'Security Guard' },
      ],
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    },
  },
  methods: {
    refreshEmployeeDetails() {
      if (this.id != -1) {
        EmployeeDataService.retrieveEmployee(this.id).then((res) => {
          this.full_name = res.data.full_name
          this.age = res.data.age
          this.position = res.data.position
        })
      }
    },
    validateAndSubmit(e) {
      e.preventDefault()
      this.errors = []
      this.message = ''

      // TODO: put validations in a separate function
      if (!this.full_name) {
        this.errors.push('Full name is required')
      } else if (this.full_name.length < 3) {
        this.errors.push('Full name must be at least 3 characters long')
      }
      if (!this.age || this.age < 18) {
        this.errors.push('Age must be at least 18')
      }
      if (!this.position) {
        this.errors.push('Position is required')
      }

      if (this.errors.length === 0) {
        this.saveEmployee()
      }
    },

    async saveEmployee() {
      const employeeData = {
        full_name: this.full_name,
        age: this.age,
        position: this.position,
      }

      try {
        if (this.id == -1) {
          await EmployeeDataService.createEmployee(employeeData)
          // Clear form after successful save
          this.full_name = ''
          this.age = 18
          this.position = ''
          // Display success message
          this.message = 'Employee created successfully!'
          this.$router.push('/employees')
        } else {
          this.errors.push('Unsupported operation: Edit employee is currently disabled')
          /// Edit employee
          // await EmployeeDataService.updateEmployee(this.id, {
          //   id: this.id,
          //   ...employeeData,
          // })
          // this.$router.push('/emloyees')
        }
      } catch (err) {
        if (err.response && err.response.data && err.response.data.detail) {
          this.errors.push(err.response.data.detail)
        } else {
          this.errors.push('An error occurred while saving the employee')
        }
      }
    },
  },
  created() {
    this.refreshEmployeeDetails()
  },
}
</script>
