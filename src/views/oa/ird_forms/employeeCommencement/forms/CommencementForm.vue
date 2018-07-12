<template>
  <div style="position:relative;">
    <div class="row">
      <div class="col-sm-12">
        <div class="btn-group btn-group-gap pull-right">
          <button type="button" class="btn btn-width-80 btn-primary"
                  @click="saveRecord">{{ $t('buttons.submit') }}</button>
          <button type="button" class="btn btn-width-80 btn-outline-primary"
                  @click="cancel">{{ $t('buttons.cancel') }}</button>
        </div>
      </div>
    </div>
    <hr/>
    <div class="row" v-if="form">
      <div class="col-sm-7">
        <div class="form-group row">
          <label class="text-right col-sm-3 col-form-label" for="formNo">{{ $t('tax.form_no') }}</label>
          <div class="col-sm-9">
            <input v-model="form.form_no"
                   class="form-control"
                         id="formNo"
                         type="text"/>
          </div>
        </div>
        <div class="form-group row">
          <label class="text-right col-sm-3 col-form-label" for="formDate">{{ $t('tax.form_date') }}</label>
          <div class="col-sm-9">
            <date-picker v-model="form.form_date"
                         id="formDate"
                         type="date" format="YYYY-MM-DD"></date-picker>
          </div>
        </div>
        <div class="form-group row">
          <label class="text-right col-sm-3 col-form-label" for="formRemark">{{ $t('tax.form_date') }}</label>
          <div class="col-sm-9">
            <textarea v-model="form.remark"
                      class="form-control"
                      rows="5"
                         id="formRemark"></textarea>
          </div>
        </div>
      </div>
      <div class="col-sm-5">
        <div class="form-group row">
          <label class="text-right col-sm-4 col-form-label" for="formDate">{{ $t('general.status') }}</label>
          <div class="col-sm-4">
            <input type="text" readonly class="form-control" id="status" :value="$t('general.' + form.status)">
          </div>
        </div>
      </div>
    </div>
    <employee-table
      :title="$t('general.employee')"
      @onEmployeesUpdated="onEmployeesUpdatedHandler"
      @onEmployeesRemoved="onEmployeesRemovedHandler"
      @onCommand="onCommandHandler"
      :employees="form ? form.employees : []"></employee-table>
  </div>
</template>

<script>
import DatePicker from 'vue2-datepicker'
import EmployeeTable from './EmployeeTable'
import * as constants from '@/store/constants.json'

export default {
  components: {
    'date-picker': DatePicker,
    'employee-table': EmployeeTable
  },
  data () {
    return {
      formType: 'commencements',
      form: {
        type: Object,
        default () {
          return {
            'id': 0,
            'form_no': '',
            'form_date': '',
            'subject': '',
            'remark': '',
            'status': 'pending',
            'employees': []
          }
        }
      }
    }
  },
  props: {
    formId: {
      type: Number,
      default: 0
    }
  },
  computed: {
    employees () {
      return this.$store.getters.employees
    },
    activeForm () {
      return this.$store.getters.activeForm
    }
  },
  mounted () {
    this.refresh()
    // console.log('CommencementForm mounted: record: ', this.record)
    // let vm = this
    // vm.setFormRecord(this.record)
  },
  watch: {
    formId: function (value) {
      console.log('CommencementForm :: watch(formId)')
      this.refresh()
    },
    activeForm: function (value) {
      console.log('CommencementForm :: watch(activeForm) value: ', value)
      let vm = this
      vm.setFormRecord(value)
    },
    form: function (value) {
      console.log('CommencementForm :: watch(form)  value: ', value)
    }
    // ,
    // record: function (value) {
    //   let vm = this
    //   alert('CommencementForm :: watch(record)')
    //   console.log('CommencementForm watch: record: ', value)
    //   vm.setFormRecord(value)
    // }
  },
  methods: {
    refresh () {
      console.log('CommencementForm :: refresh')
      let vm = this
      vm.$store.dispatch('FETCH_ACTIVE_FORM', {
        id: vm.formId,
        type: 'commencement'
      })
    },
    setFormRecord (record) {
      console.log('CommencementForm :: setFormRecord :: record: ', record)
      let vm = this
      if (record) {
        vm.form = JSON.parse(JSON.stringify(record))
        for (var i = 0; i < vm.form.employees.length; i++) {
          var formEmployee = vm.form.employees[i]
          let employee = vm.employees.find(employee => employee.id === formEmployee.employee_id.toString())
          if (employee) {
            vm.form.employees[i].info = employee
            vm.form.employees[i].form_url = constants.apiUrl + '/media/forms/' + vm.formType + '/' + vm.form.id + '/' + employee.id
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
    onCommandHandler (commandOptions) {
      let command = commandOptions.command
      let vm = this
      // let options = commandOptions.options
      switch (command) {
        case 'generate':
          vm.$store.dispatch('START_FORM_GENERATION', {
            'form_id': vm.form.id
          })
          break
        case 'terminate':
          vm.$store.dispatch('TERMINATE_FORM_GENERATION', {
            'form_id': vm.form.id
          })
          break
      }
    },
    onEmployeesUpdatedHandler (employees) {
      console.log('CommencementForm :: onEmployeesUpdatedHandler')
      let vm = this
      let existedIds = vm.form.employees.map(formEmployee => formEmployee.employee_id)
      let updatedIds = employees.map(employee => employee.id)
      let obsolateIds = existedIds.filter(id => (updatedIds.indexOf(id) === -1))
      vm.form.employees = []
      for (var i = 0; i < employees.length; i++) {
        let employee = employees[i]
        if (existedIds.indexOf(employee.id) === -1) {
          vm.form.employees.push({
            'form_id': vm.form.id,
            'employee_id': employee.id,
            'info': employee,
            'status': 'pending',
            'file': '',
            'form_url': constants.apiUrl + '/media/forms/' + vm.formType + '/' + vm.form.id + '/' + employee.id
          })
        }
      }
      for (var j = 0; j < obsolateIds.length; j++) {
        let index = vm.form.employees.findIndex(formEmployee => formEmployee.employee_id === obsolateIds[j])
        if (index !== -1) {
          vm.form.employees.splice(index, 1)
        }
      }
    },
    saveRecord () {
      let vm = this
      if (vm.form.id === 0) {
        // new
        vm.$store.dispatch('SAVE_EMPLOYEE_COMMENCEMENT', vm.form).then(function (response) {
          vm.$emit('onModeChanged', 'list')
        })
      } else {
        // update
        vm.$store.dispatch('UPDATE_EMPLOYEE_COMMENCEMENT', vm.form).then(function (response) {
          vm.$emit('onModeChanged', 'list')
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
