<template>
  <div id="ird-form-record" style="position:relative;">
    <div class="row">
      <div class="col-sm-4">
        <h3 v-if="form.id===0">
          {{ $t('general.new') }}
        </h3>
        <h3 class="pull-left" v-else>
          #{{ form.form_no }}
        </h3>
      </div>
      <div v-if="form.employees" class="col-sm-8">
        <div class="row">
          <div class="col-sm text-right btn-stackable-group">
            <h4 class="d-inline text-danger pull-left">
              <span v-show="form.status==='processing'||form.status==='ready_for_processing'">
                <i class="fa fa-spinner fa-spin"></i>
                {{ $t('general.' + form.status) }}
              </span>
            </h4>

            <button type="button"
                    v-if="form.status==='processing'||form.status==='ready_for_processing'"
                    :disabled="form.status!=='processing' && form.status!=='ready_for_processing'"
                    @click="terminateGeneration"
                    class="btn min-width-80 btn-danger min-width-100">
              <i class="fa fa-hand-stop-o"></i>
              {{ $t('buttons.terminate') }}
            </button>
            <button type="button"
                    v-else
                    @click="startGeneration"
                    :disabled="whenDisabledInput||form.employees.length===0"
                    class="btn btn-outline-success min-width-100">
              <i class="fa fa-bolt"></i>
              {{ $t('buttons.generate_documents') }}
              <span v-if="loadingCommand==='generate'">
                &nbsp;<i class="fa fa-spinner fa-spin"></i>
              </span>
            </button>
            <button type="button"
                    :disabled="form.status!=='ready'"
                    @click="download"
                    class="btn min-width-80 btn-outline-primary min-width-100">
              <i class="fa fa-download"></i>
              {{ $t('buttons.download') }}
            </button>
            <button type="button"
                    :disabled="form.status==='processing'||form.status==='ready_for_processing'"
                    class="btn min-width-80 btn-outline-primary"
                    @click="saveRecord">
              <i class="fa fa-save"></i>
              {{ $t('buttons.submit') }}
              <span v-if="loadingCommand==='save'">
                &nbsp;<i class="fa fa-spinner fa-spin"></i>
              </span>
            </button>
            <button type="button"
                    class="btn min-width-80 btn-outline-default"
                    @click="cancel">
              <i class="fa fa-close"></i>
              {{ $t('buttons.cancel') }}
            </button>
          </div>
        </div>
      </div>
      <div v-else class="col-sm-8 btn-group btn-group-gap pull-right" style="height:39px;">
      </div>
    </div>
    <hr/>
    <div class="row">
      <div class="col-sm-7">

        <!-- Signature Name -->
        <div class="form-group row">
          <label class="text-sm-right col-sm-3 col-form-label" for="signatureName">{{ $t('tax.signature_name')
            }}</label>
          <div class="col-sm-9">
            <input v-model="form.signature_name"
                   name="signatureName"
                   id="signatureName"
                   v-validate="'required'"
                   :disabled="whenDisabledInput"
                   class="form-control"
                   :class="{'border-danger':errors.has('signatureName')}"
                   type="text"/>
            <span class="error" v-if="errors.has('designation')">{{ $t('messages.signature_name_is_required') }}</span>
          </div>
        </div>

        <!-- Designation -->
        <div class="form-group row">
          <label class="text-sm-right col-sm-3 col-form-label" for="designation">{{ $t('tax.signature_designation')
            }}*</label>
          <div class="col-sm-9 co-md-7 co-lg-6">
            <input v-model="form.designation"
                   name="designation"
                   id="designation"
                   v-validate="'required'"
                   :disabled="whenDisabledInput"
                   class="form-control"
                   :class="{'border-danger':errors.has('designation')}"
                   type="text"/>
            <span class="error" v-if="errors.has('designation')">{{ $t('messages.designation_is_required') }}</span>
          </div>
        </div>

        <!-- IRD Form Type Selection -->
        <div class="form-group row">
          <label class="text-sm-right col-sm-3 col-form-label" for="irdFormTypeId">{{ $t('tax.form_type') }}</label>
          <div class="col-sm-9">
            <yoov-radio-toggle
              id="irdFormTypeId"
              :disabled="whenDisabledInput"
              :options="irdFormTypeOptions"
              optionTitleTag="titleTag"
              :value="form.ird_form_type_id"
              @input="(value) => {onIrdFormTypeSelected(value)}"
            ></yoov-radio-toggle>
          </div>
        </div>

        <!-- IRD Form Selection -->
        <div class="form-group row">
          <label class="text-sm-right col-sm-3 col-form-label" for="irdFormId">{{ $t('tax.form_template') }}</label>
          <div class="col-sm-9">
            <yoov-radio-toggle
              id="irdFormId"
              :disabled="whenDisabledInput"
              :options="irdFormOptions"
              optionTitle="title"
              :value="form.ird_form_id"
              @input="(value) => {form.ird_form_id=value}"
            ></yoov-radio-toggle>
          </div>
        </div>

        <!-- fiscal year -->
        <div class="form-group row" v-show="selectedIrdForm && selectedIrdForm.requires_fiscal_year">
          <label class="text-sm-right col-sm-3 col-form-label" for="fiscalStartYear">{{ $t('tax.fiscal_years')
            }}</label>
          <div class="col-sm-9">
            <yoov-radio-toggle
              id="fiscalStartYear"
              :disabled="whenDisabledInput"
              :options="availableFiscalStartYears"
              optionTitle="title"
              :value="form.fiscal_start_year"
              @input="(value) => {form.fiscal_start_year=value}"
            ></yoov-radio-toggle>
          </div>
        </div>

        <!-- Remark -->
        <div class="form-group row">
          <label class="text-sm-right col-sm-3 col-form-label" for="formRemark">{{ $t('tax.remark') }}</label>
          <div class="col-sm-9">
            <textarea v-model="form.remark"
                      :disabled="whenDisabledInput"
                      class="form-control"
                      rows="1"
                      id="formRemark"></textarea>
          </div>
        </div>
      </div>
      <div class="col-sm-5">
        <!-- Status -->
        <div class="form-group row">
          <label class="text-sm-right col-sm-4 col-form-label" for="formDate">{{ $t('general.form_status') }}</label>
          <div class="col-sm-4">
            <input type="text" v-if="form" readonly class="form-control" id="status"
                   :value="form.status ? $t('general.' + form.status) : ''">
          </div>
        </div>

        <div class="form-group row" v-show="selectedIrdForm && selectedIrdForm.requires_fiscal_year">
          <label class="text-sm-right col-sm-4 col-form-label" for="formDate">{{ $t('tax.published') }}</label>
          <div class="col-sm-4">
            <yoov-radio-toggle
              :disabled="whenDisabledInput"
              :options="yesNoOptions"
              :value="form.published"
              :optionTitleTag="'titleTag'"
              @input="(value) => {form.published=value}"></yoov-radio-toggle>
          </div>
        </div>

        <!-- Form No. -->
        <div class="form-group row">
          <label class="text-sm-right col-sm-4 col-form-label" for="formNo">{{ $t('tax.form_no') }}*</label>
          <div class="col-sm-8">
            <input v-model="form.form_no"
                   v-validate="'required'"
                   name="formNo"
                   :disabled="whenDisabledInput"
                   class="form-control"
                   :class="{'border-danger':errors.has('formNo')}"
                   id="formNo"
                   type="text"/>
            <span class="error" v-if="errors.has('formNo')">{{ $t('message.form_no_is_required') }}</span>
          </div>
        </div>

        <!-- Form Date -->
        <div class="form-group row">
          <label class="text-sm-right col-sm-4 col-form-label" for="formDate">{{ $t('tax.form_date') }}*</label>
          <div class="col-sm-8">
            <date-picker v-model="form.form_date"
                         :disabled="whenDisabledInput"
                         id="formDate"
                         type="date"
                         format="YYYY-MM-DD"></date-picker>
          </div>
        </div>

        <!-- Submission Date -->
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

        <!-- Languages -->
        <div class="form-group row">
          <label class="text-sm-right col-sm-4 col-form-label" for="langId">
            {{ $t('general.language') }}
          </label>
          <div class="col-sm-8">
            <yoov-radio-toggle
              id="langId"
              :options="taxLanguageOptions"
              optionTitleTag="titleTag"
              v-model="form.lang_id">
            </yoov-radio-toggle>
          </div>
        </div>

        <div class="form-group row" v-if="form.files && form.files.length>0">
          <label class="text-sm-right col-sm-4 col-form-label" for="files">{{ $t('tax.related_files') }}*</label>
          <div class="col-sm-8 co-md-7 co-lg-6">
            <form-file-item
              v-for="(file, index) in form.files"
              :key="index"
              :file="file"></form-file-item>
          </div>
        </div>

      </div>
    </div>
    <hr/>
    <employee-table
      :formId="form.id"
      :title="$t('general.employee')"
      @onEmployeesAllAdded="onEmployeesAllAddedHandler"
      @onEmployeesUpdated="onEmployeesUpdatedHandler"
      @onEmployeesRemoved="onEmployeesRemovedHandler"
      @onEmployeesAllRemoved="onEmployeesAllRemovedHandler"
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
import FormFileItem from './comps/FormFileItem'
import {EventBus} from '@/event-bus'

export default {
  components: {
    'date-picker': DatePicker,
    'employee-table': EmployeeTable,
    'yoov-radio-toggle': YoovRadioToggle,
    'form-file-item': FormFileItem
  },
  data () {
    return {
      loadingCommand: '',
      yesNoOptions: [
        {titleTag: 'general.yes', value: 1},
        {titleTag: 'general.no', value: 0}
      ],
      formType: 'commencements',
      form: {
        type: Object,
        default: {
          'id': 0,
          'form_no': '',
          'form_date': '',
          'subject': '',
          'remark': '',
          'lang_id': 0,
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
    taxLanguageOptions () {
      return this.$store.getters.taxLanguageOptions
    },
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
        vm.form.status === 'completed' ||
        vm.loadingCommand !== ''
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
      console.log('irdFormOptions')
      let vm = this
      let irdFormOptions = []
      let irdFormIds = []
      let irdForms = []

      if (vm.selectedIrdFormType) {
        irdForms = vm.selectedIrdFormType.forms
      }
      // for (var i = 0; i < vm.irdFormTypes.length; i++) {
      //   let irdFormType = vm.irdFormTypes[i]
      //   if (irdFormType.id === vm.form.ird_form_type_id) {
      //     forms = irdFormType.forms
      //   }
      // }
      // check default
      let defaultId = 0
      for (var j = 0; j < irdForms.length; j++) {
        let form = irdForms[j]
        let formOption = {
          title: form.ird_code + (form.version ? ' ' + vm.$t('tax.' + form.version) : ''),
          value: form.id
        }
        irdFormIds.push(form.id)
        irdFormOptions.push(formOption)
        if (irdForms[j].is_default) {
          defaultId = irdForms[j].id
        }
      }
      console.log('irdFormOptions :: if there is any default predefined: ' + defaultId)
      if (defaultId === 0) {
        if (irdForms.length > 0) {
          defaultId = irdForms[0].id
        }
      }
      console.log('irdFormOptions :: if there is one irdForm :  defaultId = ' + defaultId)

      if (defaultId > 0) {
        console.log('irdFormOptions :: defaultId > 0 => vm.form.ird_form_id = defaultId')
        console.log('irdFormOptions :: defaultId > 0 => vm.form.ird_form_id = ' + vm.form.ird_form_id)
        console.log('irdFormOptions :: defaultId > 0 => vm.form: ', vm.form)
        if (vm.form.ird_form_id) {
          if (irdFormIds.indexOf(vm.form.ird_form_id) === -1) {
            vm.form.ird_form_id = defaultId
          }
        } else {
          vm.form.ird_form_id = defaultId
        }
      }

      return irdFormOptions
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
    // vm.linkupOAEmployee(this.record)
  },
  watch: {
    formId: function (value) {
      // EventBus.on('editRecord')
      this.refresh()
    },
    activeForm: function (value) {
      let vm = this
      console.log('watch(activeForm) :: watch(activeForm) value: ', value)
      let ids = []
      for (var i = 0; i < value.employees.length; i++) {
        ids.push(value.employees[i].employee_id + ': ' + value.employees[i].name)
      }
      console.log('watch(activeForm) :: employeeIds: ' + ids.join(', '))
      // console.log('watch(activeForm) :: watch(activeForm) value: ', value)
      vm.linkupOAEmployee(value)
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
    //   vm.linkupOAEmployee(value)
    // }
  },
  methods: {
    download () {
      let vm = this
      let url = constants.apiUrl + '/forms/' + vm.form.id + '/prepare'
      vm.axios.post(url).then(function (response) {
        if (response.data.status) {
          let key = response.data.key
          let downloadUrl = constants.apiUrl + '/temp/' + key + '/download'
          window.open(downloadUrl, '_self')
        }
      })
    },
    onIrdFormTypeSelected (value) {
      let vm = this
      if (vm.form.ird_form_type_id !== value) {
        vm.form.ird_form_type_id = value
        if (value === 2) {
          vm.$store.dispatch('FETCH_EMPLOYEES', {status: 'resigned'})
          console.log('FETCH_EMPLOYEES: resigned')
        } else {
          vm.$store.dispatch('FETCH_EMPLOYEES', {status: 'active'})
          console.log('FETCH_EMPLOYEES: active')
        }
        // vm.form.ird_form_id = vm.getDefaultIrdFormIdOfType(value)
      }
    },
    // getDefaultIrdFormIdOfType (irdFormType) {
    //   let vm = this
    //   let defaultId = 0
    //   for (var i = 0; i < vm.irdForms.length; i++) {
    //     let irdForm = vm.irdForms[i]
    //     if (irdForm.is_default) {
    //       defaultId = irdForm.id
    //     }
    //   }
    // },
    getFormOptions () {
      let vm = this
      let result = []
      if (vm.form.ird_form_id === 0) {
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
          if (defaultId === 0) {
            defaultId = vm.irdForms[0].id
          }
          vm.form.ird_form_id = defaultId
        }
      }
      return result
    },
    getFormTypeOptions () {
      let vm = this
      let result = []
      let irdFormTypes = vm.irdFormTypes
      console.log('getFormTypeOptions: ', irdFormTypes)
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
    updateEmployeeStatus (employeeId, status, sheetNo) {
      let vm = this
      for (var i = 0; i < vm.form.employees.length; i++) {
        if (vm.form.employees[i].employee_id === parseInt(employeeId)) {
          vm.form.employees[i].status = status
          if (typeof sheetNo !== 'undefined') {
            vm.form.employees[i].sheetNo = sheetNo
          }
          break
        }
      }
      // console.log('updateEmployeeStatus :: vm.form.employee', vm.form.employees)
    },
    onEmployeesUpdatedHandler (employees) {
      console.log('onEmployeesUpdated (after selection from dialog): employees:', employees)
      let vm = this
      let existedIds = vm.form.employees.map(formEmployee => formEmployee.employee_id.toString())
      let updatedIds = employees.map(employee => employee.id)
      let obsolateIds = existedIds.filter(id => (updatedIds.indexOf(id) === -1))

      // console.log('CommencementForm :: onEmployeeUpdateHandler :: existedIds: ', existedIds)
      // console.log('CommencementForm :: onEmployeeUpdateHandler :: updatedIds: ', updatedIds)
      // console.log('CommencementForm :: onEmployeeUpdateHandler :: obsolateIds: ', obsolateIds)

      for (var i = 0; i < employees.length; i++) {
        let oaEmployee = employees[i]
        if (existedIds.indexOf(oaEmployee.id) === -1) {
          vm.form.employees.push({
            'form_id': vm.form.id,
            'employee_id': parseInt(oaEmployee.id),
            'status': 'pending',
            'file': '',
            'name': oaEmployee.displayName,
            // specical
            'joinedDate': oaEmployee.joinedDate,
            'form_url': constants.apiUrl + '/media/ird_forms/' + vm.form.id + '/' + oaEmployee.id,
            'info': oaEmployee
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
    linkupOAEmployee (record) {
      let vm = this
      console.log('linkupOAEmployee :: vm.employees: ', vm.employees)
      // console.log('IrdFormRecord.vue :: linkupOAEmployee :: record: ', record)
      // console.log('IrdFormRecord.vue :: linkupOAEmployee :: record.ird_form_id = ' + record.ird_form.id)
      if (record) {
        // console.log('IrdFormRecord.vue :: linkupOAEmployee :: record exists')
        vm.form = JSON.parse(JSON.stringify(record))
        // console.log('IrdFormRecord.vue :: linkupOAEmployee :: record.ird_form_id = ' + record.ird_form.id)
        // console.log('IrdFormRecord.vue :: linkupOAEmployee :: form.ird_form_id = ' + vm.form.ird_form.id)

        let employeeIds = []
        for (var j = 0; j < vm.employees.length; j++) {
          employeeIds.push(vm.employees[j].id)
        }
        console.log('linkupOAEmployee :: ids = ' + employeeIds.join(','))

        for (var i = 0; i < vm.form.employees.length; i++) {
          var formEmployee = vm.form.employees[i]
          let oaEmployee = vm.employees.find(employee => employee.id === formEmployee.employee_id.toString())
          if (oaEmployee) {
            // special
            vm.form.employees[i].name = oaEmployee.displayName
            vm.form.employees[i].info = oaEmployee
            vm.form.employees[i].joinedDate = oaEmployee.joinedDate
            vm.form.employees[i].form_url = constants.apiUrl + '/media/ird_forms/' + vm.form.id + '/' + oaEmployee.id
          }
        }
        if (vm.form.id === 0) {
          console.log('IrdFormRecord.vue :: linkupOAEmployee :: (vm.form.id === 0)')
          vm.form.ird_form_type_id = vm.defaultIrdFormTypeId
          vm.form.ird_form_id = vm.getDefaultFormId
        } else {
          // console.log('IrdFormRecord.vue :: linkupOAEmployee :: (vm.form.id !== 0)')
        }
        // console.log('IrdFormRecord.vue :: linkupOAEmployee :: form.ird_form_id = ' + vm.form.ird_form.id)
        // console.log('IrdFormRecord.vue :: linkupOAEmployee :: record => form (after): ', vm.form)
      }
    },

    onEmployeesAllAddedHandler () {
      let vm = this
      for (var i = 0; i < vm.employees.length; i++) {
        let oaEmployee = vm.employees[i]
        let oaEmployeeId = parseInt(oaEmployee.id)
        if (!vm.form.employees.find(element => element.employee_id === oaEmployeeId)) {
          vm.form.employees.push({
            'form_id': vm.form.id,
            'employee_id': oaEmployeeId,
            'status': 'pending',
            'file': '',
            'name': oaEmployee.displayName,
            // specical
            'joinedDate': oaEmployee.joinedDate,
            'form_url': constants.apiUrl + '/media/ird_forms/' + vm.form.id + '/' + oaEmployee.id,
            'info': oaEmployee
          })
        }
      }
    },

    onEmployeesAllRemovedHandler (employees) {
      this.form.employees = []
    },

    onEmployeesRemovedHandler (employees) {
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
    grabYear (moment) {
      let vm = this
      if (moment) {
        let m = vm.$moment(moment)
        return m.format('YYYY-MM-DD')
      } else {
        return null
      }
    },
    saveRecord (callback) {
      let vm = this
      vm.$validator.validateAll()
      vm.$nextTick(function () {
        if (!vm.errors.any()) {
          if (vm.loadingCommand === '') {
            vm.loadingCommand = 'save'
          }
          if (vm.form.id === 0) {
            // new
            vm.form.form_date = vm.grabYear(vm.form.form_date)
            vm.form.submitted_on = vm.grabYear(vm.form.submitted_on)
            vm.$store.dispatch('SAVE_FORM_RECORD', vm.form).then(function (response) {
              console.log('SAVE_FORM_RECORD :: response: ', response)
              if (typeof callback === 'function') {
                vm.$emit('onFormSaved', response.id)
                callback(response)
              } else {
                vm.$emit('onModeChanged', 'list')
              }
            })
          } else {
            // update
            vm.form.form_date = vm.grabYear(vm.form.form_date)
            vm.form.submitted_on = vm.grabYear(vm.form.submitted_on)
            vm.$store.dispatch('UPDATE_FORM_RECORD', vm.form).then(function (response) {
              console.log('UPDATE_FORM_RECORD :: response: ', response)
              if (typeof callback === 'function') {
                callback(response)
              } else {
                vm.$emit('onModeChanged', 'list')
              }
            })
          }
        } else {
          vm.loadingCommand = ''
        }
      })
    },
    onCommandHandler (commandOptions) {
      let command = commandOptions.command
      let vm = this

      vm.loadingCommand = command
      switch (command) {
        case 'selectEmployee':
          let employeeStatus = vm.form.ird_form_type_id === 2 ? 'resigned' : 'active'
          EventBus.$emit('showSelectEmployeeDialog', {
            ...commandOptions,
            employeeStatus: employeeStatus
          })
          vm.loadingCommand = ''
          break
        case 'generate':
          vm.saveRecord((result) => {
            vm.$store.dispatch('FETCH_ACTIVE_FORM', {id: result.id}).then(function (response) {
              vm.$store.dispatch('START_FORM_GENERATION', {
                'formId': vm.form.id,
                'formType': vm.formType
              }).then(function (response) {
                vm.loadingCommand = ''
                console.log('save_and_generate :: saveRecord :: FETCH_ACTIVE_FORM :: START_FORM_GENERATION :: response: ', response)
              })
            })
          })
          break
        case 'terminate':
          vm.$store.dispatch('TERMINATE_FORM_GENERATION', {
            'formId': vm.form.id,
            'formType': vm.formType
          }).then(function (response) {
            vm.loadingCommand = ''
          })
          break
      }
    },
    cancel () {
      this.$emit('onModeChanged', 'list')
    }
  }
}
</script>

<style>
  #ird-form-record button[disabled=disabled],
  #ird-form-record button[disabled=disabled]:hover {
    cursor: default;
  }

  @media (min-width: 768px) {
    .text-sm-right {
      text-align: right;
    }
  }
</style>
