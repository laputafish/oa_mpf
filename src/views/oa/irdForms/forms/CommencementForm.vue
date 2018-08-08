<template>
  <div style="position:relative;">
    <div class="row">
      <div class="col-sm-12">
        <h3 class="pull-left" v-if="form.id===0">
          {{ $t('general.new') }}
        </h3>
        <h3 class="pull-left" v-else>
          #{{ form.form_no }}
        </h3>
        <div v-if="form.employees" class="btn-group btn-group-gap pull-right">
          <h4 class="d-inline pt-1 text-danger">
            <span v-show="form.status==='processing'">
              <i class="fa fa-spinner fa-spin"></i>
              {{ $t('general.processing') }}
            </span>
          </h4>
          &nbsp;&nbsp;
          <button type="button"
                  @click="startGeneration"
                  :disabled="whenDisabledInput||form.employees.length===0"
                  class="btn btn-outline-success">
            <i class="fa fa-bolt"></i>
            {{ $t('buttons.generate_ir56e') }}</button>
          <button type="button"
                  :disabled="form.status!=='generating' && form.status!=='ready_for_processing'"
                  @click="terminateGeneration"
                  class="btn btn-width-80 btn-outline-danger">
            <i class="fa fa-hand-stop-o"></i>
            {{ $t('buttons.terminate') }}</button>
          <button type="button"
                  :disabled="form.status==='generating'||form.status==='ready_for_processing'"
                  class="btn btn-width-80 btn-outline-primary"
                  @click="saveRecord">
            <i class="fa fa-save"></i>
            {{ $t('buttons.submit') }}</button>
          <button type="button"
                  class="btn btn-width-80 btn-outline-default"
                  @click="cancel">
            <i class="fa fa-close"></i>
            {{ $t('buttons.cancel') }}</button>
        </div>
        <div v-else class="btn-group btn-group-gap pull-right" style="height:39px;">
        </div>
      </div>
    </div>
    <hr/>
    <div class="row">
      <div class="col-sm-7">
        <div class="form-group row">
          <label class="text-sm-right col-sm-3 col-form-label" for="formNo">{{ $t('tax.form_no') }}</label>
          <div class="col-sm-9">
            <input v-model="form.form_no"
                   :disabled="whenDisabledInput"
                   class="form-control"
                   id="formNo"
                   type="text"/>
          </div>
        </div>
        <div class="form-group row">
          <label class="text-sm-right col-sm-3 col-form-label" for="formDate">{{ $t('tax.form_date') }}</label>
          <div class="col-sm-9">
            <date-picker v-model="form.form_date"
                         :disabled="whenDisabledInput"
                         id="formDate"
                         type="date"
                         format="YYYY-MM-DD"></date-picker>
          </div>
        </div>

        <!-- Form Type Selection -->
        <div class="form-group row">
          <label class="text-sm-right col-sm-3 col-form-label" for="formRemark">{{ $t('tax.form_type') }}</label>
          <div class="col-sm-9">
            <yoov-radio-toggle
              :options="formTypeOptions"
              optionTitleTag="titleTag"
              :value="form.ird_form_type_id"
              @input="(value) => {form.ird_form_type_id=value}"
              ></yoov-radio-toggle>
          </div>
        </div>

        <!-- Form Selection -->
        <div class="form-group row">
          <label class="text-sm-right col-sm-3 col-form-label" for="formRemark">{{ $t('tax.form_template') }}</label>
          <div class="col-sm-9">
            <yoov-radio-toggle
              :options="formOptions"
              optionTitle="title"
              :value="form.ird_form_id"
              @input="(value) => {form.ird_form_id=value}"
            ></yoov-radio-toggle>
          </div>
        </div>

        <!-- fiscal year -->
        <div class="form-group row" v-show="selectedForm && selectedForm.requires_fiscal_year">
          <label class="text-sm-right col-sm-3 col-form-label" for="formRemark">{{ $t('tax.fiscal_years') }}</label>
          <div class="col-sm-9">
            <yoov-radio-toggle
              :options="availableFiscalStartYears"
              optionTitle="title"
              :value="form.fiscal_start_year"
              @input="(value) => {form.fiscal_start_year=value}"
            ></yoov-radio-toggle>
          </div>
        </div>

        <div class="form-group row">
          <label class="text-sm-right col-sm-3 col-form-label" for="formRemark">{{ $t('tax.remark') }}</label>
          <div class="col-sm-9">
            <textarea v-model="form.remark"
                      :disabled="whenDisabledInput"
                      class="form-control"
                      rows="5"
                      id="formRemark"></textarea>
          </div>
        </div>
      </div>
      <div class="col-sm-5">
        <div class="form-group row">
          <label class="text-sm-right col-sm-4 col-form-label" for="formDate">{{ $t('general.form_status') }}</label>
          <div class="col-sm-4">
            <input type="text" v-if="form" readonly class="form-control" id="status" :value="form.status ? $t('general.' + form.status) : ''">
          </div>
        </div>
        <div class="form-group row">
          <label class="text-sm-right col-sm-4 col-form-label" for="submittedOn">{{ $t('tax.submitted_on') }}</label>
          <div class="col-sm-4">
            <date-picker v-model="form.submitted_on"
                         :disabled="whenDisabledInput"
                         id="submittedOn"
                         type="date"
                         format="YYYY-MM-DD"></date-picker>
          </div>
        </div>

        <!-- Signature Name -->
        <div class="form-group row">
          <label class="text-sm-right col-sm-4 col-form-label" for="signature">{{ $t('tax.signature') }}</label>
          <div class="col-sm-8">
            <input v-model="form.signature_name"
                   :disabled="whenDisabledInput"
                   class="form-control"
                   id="signature"
                   type="text"/>
          </div>
        </div>

        <!-- Designation -->
        <div class="form-group row">
          <label class="text-sm-right col-sm-4 col-form-label" for="designation">{{ $t('tax.designation') }}</label>
          <div class="col-sm-8">
            <input v-model="form.designation"
                   :disabled="whenDisabledInput"
                   class="form-control"
                   id="designation"
                   type="text"/>
          </div>
        </div>

      </div>
    </div>
    <hr/>
    <employee-table
      :title="$t('general.employee')"
      @onEmployeesUpdated="onEmployeesUpdatedHandler"
      @onEmployeesRemoved="onEmployeesRemovedHandler"
      @onCommand="onCommandHandler"
      :status="form ? form.status : 'disabled'"
      :employees="form ? form.employees : []"></employee-table>
  </div>
</template>

<script>
import DatePicker from 'vue2-datepicker'
import EmployeeTable from './EmployeeTable'
import * as constants from '@/store/constants.json'
import YoovRadioToggle from '@/components/forms/YoovRadioToggle'

export default {
  components: {
    'date-picker': DatePicker,
    'employee-table': EmployeeTable,
    'yoov-radio-toggle': YoovRadioToggle
  },
  data () {
    return {
      formType: 'commencements',
      form: {
        type: Object,
        default: {
          'id': 0,
          'form_no': '',
          'form_date': '',
          'subject': '',
          'remark': '',
          'status': 'pending',
          'submitted_on': '',
          'employees': []
        }
      }
    }
  },
  props: {
    formId: {
      type: Number,
      default: 0
    },
    defaultIrdFormTypeId: {
      type: Number,
      default: 0
    }
  },
  computed: {
    availableFiscalStartYears () {
      return this.$store.getters.availableFiscalStartYears
    },
    employees () {
      return this.$store.getters.employees
    },
    activeForm () {
      return this.$store.getters.activeForm
    },
    whenDisabledInput () {
      let vm = this
      return vm.form.status === 'processing' ||
        vm.form.status === 'ready_for_processing' ||
        vm.form.status === 'completed'
    },
    irdFormTypes () {
      return this.$store.getters.irdFormTypes
    },
    irdFormTypeOptions () {
      return this.getFormTypeOptions()
    },
    selectedIrdForm () {
      let vm = this
      let result = null
      if (vm.form.ird_form_id && vm.form.ird_form_id !== 0 && vm.selectedIrdFormType) {
        var forms = vm.selectedIrdFormType.forms
        for (var i = 0; i < forms.length; i++) {
          let form = forms[i]
          if (form.id === vm.form.ird_form_id) {
            result = form
            break
          }
        }
      }
      return result
    },
    selectedIrdFormType () {
      let vm = this
      console.log('computed: selectedIrdFormType: vm.irdFormTypeOptions.length = ' + vm.irdFormTypes.length)
      console.log('computed: selectedIrdFormType :: form.ird_form_type_id = ' + vm.form.ird_form_type_id)
      let result = null
      for (var i = 0; i < vm.irdFormTypes.length; i++) {
        let irdFormType = vm.irdFormTypes[i]
        if (irdFormType.id === vm.form.ird_form_type_id) {
          result = irdFormType
          break
        }
      }
      console.log('computed: selectedIrdFormType :: result: ', result)
      return result
    },
    irdFormOptions () {
      let vm = this
      let formOptions = []

      let forms = []
      if (vm.selectedIrdFormType) {
        forms = vm.selectedIrdFormType.forms
      }
      // for (var i = 0; i < vm.irdFormTypes.length; i++) {
      //   let irdFormType = vm.irdFormTypes[i]
      //   if (irdFormType.id === vm.form.ird_form_type_id) {
      //     forms = irdFormType.forms
      //   }
      // }
      // check default
      let defaultId = 0
      for (var j = 0; j < forms.length; j++) {
        let form = forms[j]
        let formOption = {
          title: form.ird_code + (form.version ? ' ' + vm.$t('tax.' + form.version) : ''),
          value: form.id
        }
        formOptions.push(formOption)
        if (forms[j].is_default) {
          defaultId = forms[j].id
        }
      }
      if (defaultId > 0) {
        vm.form.ird_form_id = defaultId
      } else {
        if (forms.length > 0) {
          vm.form.ird_form_id = forms[0].id
        }
      }
      return formOptions
    },
    defaultFormId () {
      let vm = this
      let result = 0
      for (var i = 0; i < vm.irdForms.length; i++) {
        let irdForm = vm.irdForms[i]
        if (irdForm.is_default) {
          result = vm.irdForms[i].id
          break
        }
      }
      return result
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
      // console.log('CommencementForm :: watch(formId)')
      this.refresh()
    },
    activeForm: function (value) {
      // console.log('CommencementForm :: watch(activeForm) value: ', value)
      let vm = this
      vm.setFormRecord(value)
    },
    form: {
      handler: function (value) {
        // console.log('CommencementForm :: watch(form)  value: ', value)
      },
      deep: true
    },
    irdFormTypes: function (value) {
      // this.refreshFormTypeOptions()
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
    getFormOptions () {
      let vm = this
      let result = []
      if (vm.irdForms) {
        let irdForms = vm.irdForms
        let defaultId = 0
        for (var i = 0; i < irdForms.length; i++) {
          let irdForm = irdForms[i]
          let formOption = {
            titleTag: 'tax.' + irdForm.form_code.toLowerCase(),
            value: irdForm.id
          }
          if (irdForm.is_default) {
            defaultId = irdForm.id
          }
          result.push(formOption)
        }
        //
        // console.log('vm.form.ird_form_type_id = ' + vm.form.ird_form_type_id)
        // console.log('vm.defaultIrdFormTypeId = ' + vm.defaultIrdFormTypeId)
        // console.log('defaultId = ' + defaultId)
        //
        if (vm.form.ird_form_type_id === 0) {
          if (vm.defaultIrdFormTypeId === 0) {
            vm.form.ird_form_type_id = defaultId
          } else {
            vm.form.ird_form_type_id = vm.defaultIrdFormTypeId
          }
        }
      }
      return result
    },
    getFormTypeOptions () {
      let vm = this
      let result = []
      let irdFormTypes = vm.irdFormTypes
      console.log('refreshFormTypeOptions: ', irdFormTypes)
      let defaultId = 0
      for (var i = 0; i < irdFormTypes.length; i++) {
        let irdFormType = irdFormTypes[i]
        let formTypeOption = {
          titleTag: 'tax.' + irdFormType.name.toLowerCase(),
          value: irdFormType.id
        }
        if (irdFormType.is_default) {
          defaultId = irdFormType.id
        }
        result.push(formTypeOption)
      }

      console.log('vm.form.ird_form_type_id = ' + vm.form.ird_form_type_id)
      console.log('vm.defaultIrdFormTypeId = ' + vm.defaultIrdFormTypeId)
      console.log('defaultId = ' + defaultId)

      if (vm.form.ird_form_type_id === 0) {
        if (vm.defaultIrdFormTypeId === 0) {
          vm.form.ird_form_type_id = defaultId
        } else {
          vm.form.ird_form_type_id = vm.defaultIrdFormTypeId
        }
      }
      return result
    },
    startGeneration () {
      this.onCommandHandler({
        command: 'generate'
      })
    },
    terminateGeneration () {
      this.onCommandHandler({
        command: 'terminate'
      })
    },
    refresh () {
      // console.log('CommencementForm :: refresh')
      let vm = this
      vm.$store.dispatch('FETCH_ACTIVE_FORM', {
        id: vm.formId
      })
    },
    updateEmployeeStatus (employeeId, status) {
      let vm = this
      for (var i = 0; i < vm.form.employees.length; i++) {
        if (vm.form.employees[i].employee_id === parseInt(employeeId)) {
          vm.form.employees[i].status = status
          break
        }
      }
      // console.log('updateEmployeeStatus :: vm.form.employee', vm.form.employees)
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
        if (vm.form.id === 0) {
          vm.form.ird_form_type_id = vm.defaultIrdFormTypeId
          vm.form.ird_form_id = vm.getDefaultFormId
        }
        // console.log('setFormRecord :: record => form (after): ', vm.form)
      }
    },

    onEmployeesRemovedHandler (employees) {
      // console.log('CommencementForm :: onEmployeesRemovedHandler')

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
            'formId': vm.form.id,
            'formType': vm.formType
          })
          break
        case 'terminate':
          vm.$store.dispatch('TERMINATE_FORM_GENERATION', {
            'formId': vm.form.id,
            'formType': vm.formType
          })
          break
      }
    },
    onEmployeesUpdatedHandler (employees) {
      // console.log('CommencementForm :: onEmployeesUpdatedHandler')
      let vm = this
      let existedIds = vm.form.employees.map(formEmployee => formEmployee.employee_id.toString())
      let updatedIds = employees.map(employee => employee.id)
      let obsolateIds = existedIds.filter(id => (updatedIds.indexOf(id) === -1))

      // console.log('CommencementForm :: onEmployeeUpdateHandler :: existedIds: ', existedIds)
      // console.log('CommencementForm :: onEmployeeUpdateHandler :: updatedIds: ', updatedIds)
      // console.log('CommencementForm :: onEmployeeUpdateHandler :: obsolateIds: ', obsolateIds)

      for (var i = 0; i < employees.length; i++) {
        let employee = employees[i]
        if (existedIds.indexOf(employee.id) === -1) {
          vm.form.employees.push({
            'form_id': vm.form.id,
            'employee_id': employee.id.toString(),
            'info': employee,
            'status': 'pending',
            'file': '',
            'form_url': constants.apiUrl + '/media/forms/' + vm.formType + '/' + vm.form.id + '/' + employee.id
          })
        }
      }
      for (var j = 0; j < obsolateIds.length; j++) {
        let index = vm.form.employees.findIndex(formEmployee => formEmployee.employee_id.toString() === obsolateIds[j])
        if (index !== -1) {
          vm.form.employees.splice(index, 1)
        }
      }
    },
    grabYear (moment) {
      let vm = this
      if (moment) {
        let m = vm.$moment(moment)
        return m.format('YYYY-MM-DD')
      } else {
        return null
      }
    },
    saveRecord () {
      let vm = this
      if (vm.form.id === 0) {
        // new
        vm.form.form_date = vm.grabYear(vm.form.form_date)
        vm.form.submitted_on = vm.grabYear(vm.form.submitted_on)
        vm.$store.dispatch('SAVE_FORM_RECORD', vm.form).then(function (response) {
          vm.$emit('onModeChanged', 'list')
        })
      } else {
        // update
        vm.form.form_date = vm.grabYear(vm.form.form_date)
        vm.form.submitted_on = vm.grabYear(vm.form.submitted_on)
        vm.$store.dispatch('UPDATE_FORM_RECORD', vm.form).then(function (response) {
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
@media(min-width: 768px) {
  .text-sm-right {
    text-align: right;
  }
}
</style>
