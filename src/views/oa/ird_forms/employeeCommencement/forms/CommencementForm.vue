<template>
  <div style="position:relative;">
    <div class="row">
      <div class="col-sm-12">
        <div class="btn-group btn-group-gap pull-right">
          <button type="button" class="btn btn-width-80 btn-primary"
                  @click="saveRecord">{{ $t('buttons.submit') }}</button>
          <button type="button" class="btn btn-width-80 btn-default"
                  @click="cancel">{{ $t('buttons.cancel') }}</button>
        </div>
      </div>
    </div>
    <hr/>
    <div class="row">
      <div class="col-sm-6">
        <div class="form-group row">
          <label class="col-sm-4 col-form-label" for="formDate">{{ $t('tax.form_date') }}</label>
          <div class="col-sm-8">
            <date-picker v-model="form.form_date"
                         id="formDate"
                         type="date" format="YYYY-MM-DD"></date-picker>
          </div>
        </div>
      </div>
      <div class="col-sm-6">
        <div class="form-group row">
          <label class="col-sm-4 col-form-label" for="formDate">{{ $t('general.status') }}</label>
          <div class="col-sm-8">
            <input type="text" readonly class="form-control" id="status" :value="form.status">
          </div>
        </div>
      </div>
    </div>
    <employee-table
      :title="$t('general.employee')"
      @onEmployeesAdded="onEmployeesAddedHandler"
      @onEmployeesRemoved="onEmployeesRemovedHandler"
      :employees="form.employees"></employee-table>
  </div>
</template>

<script>
import DatePicker from 'vue2-datepicker'
import EmployeeTable from './EmployeeTable'

export default {
  components: {
    'date-picker': DatePicker,
    'employee-table': EmployeeTable
  },
  data () {
    return {
      form: {
        type: Object,
        default () {
          return {
            form_date: null,
            employees: []
          }
        }
      }
    }
  },
  props: {
    record: {
      type: Object,
      default: function () {
        return null
      }
    }
  },
  computed: {
    employees () {
      return this.$store.getters.employees
    }
  },
  mounted () {
    console.log('CommencementForm mounted: record: ', this.record)
    let vm = this
    vm.setFormRecord(this.record)
  },
  watch: {
    record: function (value) {
      let vm = this
      alert('CommencementForm :: watch(record)')
      console.log('CommencementForm watch: record: ', value)
      vm.setFormRecord(value)
    }
  },
  methods: {
    setFormRecord (record) {
      console.log('setFormRecord :: record: ', record)
      let vm = this
      if (record) {
        vm.form = JSON.parse(JSON.stringify(record))
        console.log('setFormRecord :: record => form (before): ', vm.form)

        for (var i = 0; i < vm.form.employees.length; i++) {
          var formEmployee = vm.form.employees[i]
          console.log('setFormRecord :: i=' + i + '.')
          console.log('setFormRecord :: formEmployee:', formEmployee)
          console.log('setFormRecord :: employees: ', vm.employees)
          let employee = vm.employees.find(employee => employee.id === formEmployee.employee_id.toString())
          console.log('i=' + i + ': employee: ', employee)
          if (employee) {
            vm.form.employees[i] = employee
          }
        }
        console.log('setFormRecord :: record => form (after): ', vm.form)
      }
    },

    onEmployeesRemovedHandler (employees) {
      console.log('CommencementForm :: onEmployeesRemovedHandler')

      if (employees.length === 0) return

      let vm = this
      let existedIds = vm.form.employees.map(employee => {
        return employee.id
      })
      let index
      let indices = []

      for (var i = 0; i < employees.length; i++) {
        let employee = employees[i]
        index = existedIds.indexOf(employee.id)
        if (index !== -1) {
          indices.push(index)
        }
      }

      for (var j = indices.length - 1; j >= 0; j--) {
        index = indices[j]
        vm.form.employees.splice(index, 1)
      }
    },
    onEmployeesAddedHandler (employees) {
      if (employees.length === 0) return

      let vm = this
      let existedIds = vm.form.employees.map(employee => {
        return employee.id
      })
      for (var i = 0; i < employees.length; i++) {
        let employee = employees[i]
        if (existedIds.indexOf(employee.id) === -1) {
          vm.form.employees.push(employee)
        }
      }
    },
    saveRecord () {
      let vm = this
      if (vm.form.id === 0) {
        // new
        vm.$store.dispatch('SAVE_COMMENCEMENT_FORM', vm.form).then(function (response) {
          vm.$store.dispatch('FETCH_EMPLOYEE_COMMENCEMENTS').then(function (response) {
            vm.$emit('onModeChanged', 'list')
          })
        })
      } else {
        // update
        vm.$store.dispatch('UPDATE_COMMENCEMENT_FORM', vm.form).then(function (response) {
          vm.$store.dispatch('FETCH_EMPLOYEE_COMMENCEMENTS').then(function (response) {
            vm.$emit('onModeChanged', 'list')
          })
        })
      }
    },
    cancel () {
      this.$emit('onModeChanged', 'list')
    }
  }
}
</script>

<style>

</style>
