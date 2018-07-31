<template>
  <div class="animated fadeIn mx-3" id="ird-forms">
    <b-card v-if="mode === 'setup'">
      <div slot="header">
        <div class="btn-group btn-group-gap card-header-toolbar">
          <!-- Button: Settings -->
          <button type="button"
                  @click="returnLastMode"
                  class="pull-right btn btn-outline-primary">
            <i class="fa fa-reply"></i>&nbsp;{{ $t('buttons.back') }}
          </button>
          <!--<button type="button"-->
          <!--@click="showSettings"-->
          <!--class="pull-right btn btn-outline-primary">-->
          <!--<i class="fa fa-gear"></i>&nbsp;{{ $t('buttons.settings') }}-->
          <!--</button>-->
        </div>
        {{ $t('tax.setup') }}
      </div>
      <ird-form-setup
        @close="returnLastMode"
        ref="setupForm"></ird-form-setup>
    </b-card>
    <b-card v-else>
      <div slot="header" >
        <div class="btn-group btn-group-gap card-header-toolbar">
          <!-- Button: Settings -->
          <button type="button"
                  @click="changeMode('setup')"
                  class="pull-right btn btn-outline-primary">
            <i class="fa fa-gear"></i>&nbsp;{{ $t('buttons.settings') }}
          </button>
          <!--<button type="button"-->
                  <!--@click="showSettings"-->
                  <!--class="pull-right btn btn-outline-primary">-->
            <!--<i class="fa fa-gear"></i>&nbsp;{{ $t('buttons.settings') }}-->
          <!--</button>-->
        </div>
        {{ $t($route.name) }}
      </div>
      <div style="position:relative;" v-if="mode==='list'">
        <div>
          <div class="text-center">
            <!-- Filters -->
            <yoov-radio-toggle
              :options="irdFormTypeFilters"
              optionTitleTag="titleTag"
              v-model="selectedIrdFormTypeId"></yoov-radio-toggle>
          </div>
        </div>

        <div style="position:relative;">
          <div class="table-toolbar btn-group">
            <!-- Button: New -->
            <button type="button"
                    @click="newForm"
                    class="btn-width-80 btn btn-primary">{{ $t('buttons.new') }}</button>
            <!--<button type="button" class="btn-width-80 btn btn-default">{{ $t('buttons.export') }}</button>-->
          </div>
        </div>
        <datatable v-cloak v-bind="$data"></datatable>
      </div>
      <ird-form-record v-if="mode=='record'"
                       ref="currentForm"
                       :formId="selectedFormId"
                       :defaultIrdFormTypeId="selectedIrdFormTypeId"
                       @onFormSaved="onFormSavedHandler"
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
import IrdFormSetup from './forms/IrdFormSetup'
import SelectEmployeeDialog from '@/dialogs/SelectEmployeeDialog'
import helpers from '@/helpers.js'
import YoovRadioToggle from '@/components/forms/YoovRadioToggle'

export default {
  components: {
    ...components,
    'ird-form-record': IrdFormRecord,
    'ird-form-setup': IrdFormSetup,
    'select-employee-dialog': SelectEmployeeDialog,
    'yoov-radio-toggle': YoovRadioToggle
  },
  data () {
    let vm = this
    return {
      lastMode: 'list',
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
          {title: vm.$t('tax.form_type'), field: 'form_type', thClass: 'text-center', tdClass: 'text-center', tdComp: 'FormType'},
          {title: vm.$t('tax.no_of_employee'), field: 'employee_count', tdClass: 'text-center', thClass: 'text-center'},
          {title: vm.$t('tax.employees'), field: 'id', tdComp: 'Employees', sortable: false},
          {title: vm.$t('tax.published'), field: 'published', thClass: 'text-center', tdComp: 'Published', tdClass: 'text-center'},
          {title: vm.$t('general.status'), field: 'status', tdComp: 'Status', thClass: 'text-center', tdClass: 'text-center'},
          {title: vm.$t('tax.submitted_on'), field: 'submitted_on', sortable: true},
          {title: vm.$t('tax.operation'), tdComp: 'Opt'}
        ]
        return cols
      })(),
      data: [],
      total: 0,
      query: {
        filter: 'ird_form_type_id:4',
        sort: 'form_no',
        order: 'desc'
      }
    }
  },
  created () {
    let vm = this
    vm.$store.dispatch('refreshOAToken').then(function (oaAuth) {
      let payload = {oaAuth: oaAuth}
      // vm.$store.dispatch('FETCH_EMPLOYEES', payload)
      // vm.$store.dispatch('FETCH_GROUPS', payload)
      vm.$store.dispatch('FETCH_IRD_FORM_TYPES', payload).then((irdFormTypes) => {
        // let defaults = irdFormTypes.filter((item) => {
        //   return item.is_default
        // })
        // if (defaults.length > 0) {
        //   let filter = 'ird_form_type_id:' + defaults[0].id
        //   vm.query = {
        //     filter: filter,
        //     sort: 'form_no',
        //     order: 'desc'
        //   }
        // }
      })
      vm.$store.dispatch('FETCH_AVAILABLE_FISCAL_YEARS', payload) // via /payrolls
    })
    // vm.query = {
    //   filter: 'ird_form_type_id:' + vm.defaultIrdFormTypeId,
    //   sort: 'form_no',
    //   order: 'desc'
    // }
    EventBus.$on('editRecord', function (record) {
      vm.selectedFormId = record.id
      // vm.selectedForm = record
      vm.mode = 'record'
    })
    EventBus.$on('deleteRecord', function (record) {
      vm.$store.dispatch('REMOVE_FORM_RECORD', record.id).then(function (response) {
        vm.onQueryChangedHandler(vm.query)
      })
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
    },
    isPayrollAdmin () {
      return this.$store.getters.isPayrollAdmin
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
    returnLastMode () {
      let vm = this
      vm.mode = vm.lastMode
      vm.lastMode = 'list'
      vm.$router.go(-1)
    },
    changeMode (mode) {
      let vm = this
      vm.lastMode = vm.mode
      vm.mode = mode
      vm.$router.push('/ird_forms/setup')
    },
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
        {channel: 'ird_form_status_updated', handler: vm.onStatusUpdated},
        {channel: 'ird_form_employee_status_updated', handler: vm.onEmployeeStatusUpdated}
      ])
    },
    newForm () {
      this.selectedFormId = 0
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
    onFormSavedHandler (formId) {
      let vm = this
      vm.selectedFormId = formId
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
    // alert('Irdforms.vue mounted')
    let vm = this
    vm.subscribe()
  },
  beforeDestroy () {
    EventBus.$off('editRecord')
    EventBus.$off('deleteRecord')
    helpers.unSubscribe(this)
  }
}
</script>

<style>
  #ird-forms .card-header > div {
    position: relative;
  }

  /*#ird-forms .card-header div div.btn-group {*/
    /*position: absolute;*/
    /*top: -1px;*/
    /*right: -5px;*/
  /*}*/

  #ird-forms .table-toolbar {
    position:absolute;
    top:0;
    right:0
  }
  div[name=Datatable] > div[name=SimpleTable] > table > tbody > tr > td {
    padding: 0.2rem;
  }

  [v-cloak] > * {
    display: none;
  }

  div[name=HeaderSettings] {
    visibility: hidden;
  }

</style>
