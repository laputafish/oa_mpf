<template>
  <div class="animated fadeIn mx-3">
    <b-card>
      <div slot="header">{{ $t($route.name) }}</div>
      <div style="position:relative;" v-if="mode==='list'">
        <div class="btn-group" style="position:absolute;top:0;right:60px;">
          <button type="button" class="btn-width-80 btn btn-primary">{{ $t('buttons.export') }}</button>
        </div>
        <datatable v-bind="$data"></datatable>
      </div>
      <commencement-form v-else
                         :record="selectedRecord"
      @onModeChanged="onModeChangedHandler"></commencement-form>
    </b-card>
    <select-employee-dialog
      v-model="showingSelectEmployeeDialog"
      @close="showingSelectEmployeeDialog=false"></select-employee-dialog>
  </div>
</template>
<script>
// import mockData from './_mockData'
import {EventBus} from '@/event-bus'
import components from './comps'
import CommencementForm from './forms/CommencementForm'
import SelectEmployeeDialog from '@/dialogs/SelectEmployeeDialog'

export default {
  components: {
    ...components,
    'commencement-form': CommencementForm,
    'select-employee-dialog': SelectEmployeeDialog
  },
  data () {
    let vm = this
    return {
      showingSelectEmployeeDialog: false,
      selectedRecord: null,
      mode: 'list',
      columns: (() => {
        const cols = [
          {title: vm.$t('tax.form_date'), field: 'form_date', sortable: true},
          {title: vm.$t('general.status'), field: 'status', tdComp: 'Status'},
          {title: vm.$t('tax.no_of_employee'), field: 'employee_count', tdClass: 'text-center', thClass: 'text-center'},
          {title: vm.$t('tax.employees'), field: 'id', tdComp: 'Employees', sortable: false},
          {title: vm.$t('tax.operation'), tdComp: 'Opt'}
        ]
        return cols
      })(),
      data: [],
      total: 0,
      query: {}
    }
  },
  created () {
    let vm = this
    EventBus.$on('editRecord', function (record) {
      vm.selectedRecord = record
      vm.mode = 'record'
    })
  },
  beforeDestroy () {
    EventBus.$off('editRecord')
  },
  watch: {
    query: {
      handler (query) {
        let vm = this
        console.log('handler :: EmployeeCommencement :: query: ', query)
        vm.$store.dispatch('FETCH_EMPLOYEE_COMMENCEMENTS', query).then(function (response) {
          console.log('FETCH_EMPLOYEE_COMMENCEMENTS.then :: response:', response)
          vm.data = response.data
          vm.total = response.total
        })
        // mockData(query).then(({ rows, total }) => {
        //   this.data = rows
        //   this.total = total
        // })
      },
      deep: true
    }
  },
  methods: {
    onModeChangedHandler (mode) {
      this.mode = mode
    }
  }
}
</script>
