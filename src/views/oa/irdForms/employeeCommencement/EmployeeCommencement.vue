<template>
  <div class="animated fadeIn mx-3">
    <b-card>
      <div slot="header">{{ $t($route.name) }}</div>
      <div style="position:relative;" v-if="mode==='list'">
        <div class="btn-group" style="position:absolute;top:0;right:60px;">
          <button type="button"
                  @click="newForm"
                  class="btn-width-80 btn btn-primary">{{ $t('buttons.new') }}</button>
          <!--<button type="button" class="btn-width-80 btn btn-default">{{ $t('buttons.export') }}</button>-->
        </div>
        <datatable v-bind="$data"></datatable>
      </div>
      <commencement-form ref="currentForm" v-else
                         :formId="selectedFormId"
                         @onModeChanged="onModeChangedHandler"></commencement-form>
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
import CommencementForm from './forms/CommencementForm'
import SelectEmployeeDialog from '@/dialogs/SelectEmployeeDialog'
import helpers from '@/helpers.js'

export default {
  components: {
    ...components,
    'commencement-form': CommencementForm,
    'select-employee-dialog': SelectEmployeeDialog
  },
  data () {
    let vm = this
    return {
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
    showingSelectEmployeeDialog () {
    }
  },
  methods: {
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
      vm.$store.dispatch('FETCH_EMPLOYEE_COMMENCEMENTS', query).then(function (response) {
        console.log('onQueryChangedHandler after FETCH_EMPLOYEE_COMMENCEMENTS.then :: response:', response)
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
    vm.$store.dispatch('FETCH_EMPLOYEES')
    vm.$store.dispatch('FETCH_GROUPS')
  },
  beforeDestroy () {
    EventBus.$off('editRecord')
    helpers.unSubscribe(this)
  }
}
</script>

<style>
div[name=Datatable] > div[name=SimpleTable] > table > tbody > tr > td {
  padding: 0.2rem;
}
</style>
