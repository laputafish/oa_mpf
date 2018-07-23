<template>
  <div class="animated fadeIn mx-3" id="ird-forms">
    <b-card>
      <div slot="header" >
        <div class="btn-group btn-group-gap">
          <button type="button"
                  @click="showSettings"
                  class="pull-right btn btn-outline-primary">
            <i class="fa fa-gear"></i>&nbsp;{{ $t('buttons.settings') }}
          </button>
        </div>
        {{ $t($route.name) }}
      </div>
      <div style="position:relative;" v-if="mode==='list'">
        <div>
          <div class="text-center">
            <yoov-radio-toggle
              :options="irdFormTypeFilters"
              optionTitleTag="titleTag"
              v-model="selectedIrdFormTypeId"></yoov-radio-toggle>
          </div>
        </div>

        <div style="position:relative;">
          <div class="btn-group" style="position:absolute;top:0;right:60px;">
            <button type="button"
                    @click="newForm"
                    class="btn-width-80 btn btn-primary">{{ $t('buttons.new') }}</button>
            <!--<button type="button" class="btn-width-80 btn btn-default">{{ $t('buttons.export') }}</button>-->
          </div>
        </div>
        <datatable v-bind="$data"></datatable>
      </div>
      <ird-form-record ref="currentForm" v-else
                         :formId="selectedFormId"
                         :defaultIrdFormTypeId="selectedIrdFormTypeId"
                         @onModeChanged="onModeChangedHandler"></ird-form-record>
    </b-card>
    <select-employee-dialog
      ref="selectEmployeeDialog"
      v-model="showingSelectEmployeeDialog"
      :defaultSelectedEmployeeIds="selectedFormEmployeeIds"
      @close="$store.commit('hideSelectEmployeeDialog')"></select-employee-dialog>
  </div>
</template>
<script>
// import mockData from './_mockData'
import {EventBus} from '@/event-bus'
import components from './comps'
import IrdFormRecord from './forms/IrdFormRecord'
import SelectEmployeeDialog from '@/dialogs/SelectEmployeeDialog'
import helpers from '@/helpers.js'
import YoovRadioToggle from '@/components/forms/YoovRadioToggle'

export default {
  components: {
    ...components,
    'ird-form-record': IrdFormRecord,
    'select-employee-dialog': SelectEmployeeDialog,
    'yoov-radio-toggle': YoovRadioToggle
  },
  data () {
    let vm = this
    return {
      irdFormTypeFilters: [],
      showingTaxFormSettingsDialog: false,
      selectedIrdFormTypeId: 0,
      // Pusher
      pusher: null,
      pusherSubscribed: false,
      selectedFormId: 0,
      selectedFormEmployeeIds: [],
      // selectedForm: null,
      mode: 'list', // ['list','record']
      columns: (() => {
        const cols = [
          {title: vm.$t('tax.form_date'), field: 'form_date', sortable: true},
          {title: vm.$t('tax.form_no'), field: 'form_no', sortable: true},
          {title: vm.$t('tax.form_type'), field: 'form_type'},
          {title: vm.$t('tax.no_of_employee'), field: 'employee_count', tdClass: 'text-center', thClass: 'text-center'},
          {title: vm.$t('tax.employees'), field: 'id', tdComp: 'Employees', sortable: false},
          {title: vm.$t('general.status'), field: 'status', tdComp: 'Status'},
          {title: vm.$t('tax.submitted_on'), field: 'submitted_on', sortable: true},
          {title: vm.$t('tax.operation'), tdComp: 'Opt'}
        ]
        return cols
      })(),
      data: [],
      total: 0,
      query: {
        sort: 'form_date',
        order: 'desc'
      }
    }
  },
  created () {
    let vm = this
    EventBus.$on('editRecord', function (record) {
      vm.selectedFormId = record.id
      // vm.selectedForm = record
      vm.mode = 'record'
    })
    EventBus.$on('showSelectEmployeeDialog', function (selectedFormEmployeeIds) {
      console.log('EventBus.on(showSelectEmployeeDialog)')
      vm.selectedFormEmployeeIds = selectedFormEmployeeIds
      vm.$refs.selectEmployeeDialog.show()
    })
  },
  computed: {
    irdFormTypes () {
      return this.$store.getters.irdFormTypes
    },
    // selectedFormId () {
    //   return
    //   selectedForm ? selectedForm.id : 0
    // },

    showingSelectEmployeeDialog () {
      let result = this.$store.getters.showingSelectEmployeeDialog
      console.log('EmployeeCommencement.vaue result: ', result)
      return result
    },
    // selectedFormEmployeeIds () {
    //   return this.$store.getters.selectedFormEmployeeIds
    // },
    teamId () {
      return this.$store.getters.teamId
    }
  },
  watch: {
    query: {
      handler (query) {
        this.onQueryChangedHandler(query)
        // mockData(query).then(({ rows, total }) => {
        //   this.data = rows
        //   this.total = total
        // })
      },
      deep: true
    },
    teamId: function (value) {
      this.subscribe()
    },
    selectedIrdFormTypeId: function (value) {
      this.$set(this.query, 'filter', 'ird_form_type_id:' + value)
    },
    showingSelectEmployeeDialog () {
    },
    irdFormTypes: function (value) {
      let vm = this
      vm.irdFormTypeFilters = [
        {
          titleTag: 'general.all',
          value: 0
        }
      ]
      for (var i = 0; i < value.length; i++) {
        let irdFormType = value[i]
        let irdFormTypeFilter = {
          titleTag: 'tax.' + irdFormType.name.toLowerCase(),
          value: irdFormType.id
        }
        vm.irdFormTypeFilters.push(irdFormTypeFilter)
        if (irdFormType.is_default) {
          vm.selectedIrdFormTypeId = irdFormType.id
        }
      }
      console.log('*** SELECTED ID: ' + vm.selectedIrdFormTypeId)
    }
  },
  methods: {
    showSettings () {
      this.$store.dispatch('SHOW_TAX_FORM_SETTINGS_DIALOG')
    },
    updateFormStatus (formId, status) {
      let vm = this
      if (vm.mode === 'record') {
        console.log('updateFormStatus :: status = ' + status)
        vm.$refs.currentForm.refresh()
      } else {
        for (var i = 0; i < vm.data.length; i++) {
          if (vm.data[i].id === parseInt(formId)) {
            vm.data[i].status = status
          }
        }
      }
    },

    updateFormEmployeeStatus (formId, employeeId, status) {
      let vm = this
      if (vm.mode === 'record') {
        vm.$refs.currentForm.updateEmployeeStatus(employeeId, status)
      }
    },

    onStatusUpdated (data) {
      let statusInfo = data.statusInfo
      let formId = statusInfo.formId.toString()
      let status = statusInfo.status

      console.log('Pusher :: received: form#' + formId + ' (status=' + status + ')')
      this.updateFormStatus(formId, status)
    },
    onEmployeeStatusUpdated (data) {
      let statusInfo = data.statusInfo
      let formId = statusInfo.formId.toString()
      let employeeId = statusInfo.employeeId.toString()
      let status = statusInfo.status
      this.updateFormEmployeeStatus(formId, employeeId, status)
      console.log('Pusher (formEmployee) :: form#' + formId + ' employee#' + employeeId + ' (status=' + status + ')')
      // let formId = statusInfo.formId.toString()
      // let status = statusInfo.status
      //
      // console.log('onEmployeeStatusUpdated :: data: ', data)
    },
    subscribe () {
      let vm = this
      helpers.subscribe(vm, vm.teamId, [
        {channel: 'commencement_form_status_updated', handler: vm.onStatusUpdated},
        {channel: 'commencement_form_employee_status_updated', handler: vm.onEmployeeStatusUpdated}
      ])
    },
    newForm () {
      this.mode = 'record'
    },
    onQueryChangedHandler (query) {
      let vm = this
      console.log('onQueryChangedHandler :: query: ', query)
      vm.$store.dispatch('FETCH_FORMS', query).then(function (response) {
        vm.data = response.data
        vm.total = response.total
      })
    },
    onModeChangedHandler (mode) {
      let vm = this
      console.log('onModeChangedHandler :: mode = ' + mode)
      console.log('onModeChangedHandler :: vm.mode = ' + vm.mode)
      if (vm.mode !== mode) {
        console.log('onModeChangedHandler :: different')
        vm.mode = mode
        if (vm.mode === 'list') {
          vm.onQueryChangedHandler(vm.query)
        }
      }
    }
  },
  mounted () {
    let vm = this
    vm.subscribe()
    vm.$store.dispatch('refreshOAToken').then(function (oaAuth) {
      let payload = {oaAuth: oaAuth}
      // vm.$store.dispatch('FETCH_EMPLOYEES', payload)
      // vm.$store.dispatch('FETCH_GROUPS', payload)
      vm.$store.dispatch('FETCH_IRD_FORM_TYPES', payload)
      vm.$store.dispatch('FETCH_AVAILABLE_FISCAL_YEARS', payload) // via /payrolls
    })
  },
  beforeDestroy () {
    EventBus.$off('editRecord')
    helpers.unSubscribe(this)
  }
}
</script>

<style>
  #ird-forms .card-header > div {
    position: relative;
  }

  #ird-forms .card-header div div.btn-group {
    position: absolute;
    top: -1px;
    right: -5px;
  }

  div[name=Datatable] > div[name=SimpleTable] > table > tbody > tr > td {
    padding: 0.2rem;
  }
</style>
