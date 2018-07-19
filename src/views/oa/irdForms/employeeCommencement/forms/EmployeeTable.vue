<template>
  <div style="position:relative;" class="employee-table">
    <div class="table-title">
      <div class="mt-1">{{ title }}</div>
    </div>
    <div class="btn-group btn-group-gap" style="position:absolute;top:0;right:60px;">
      <button type="button"
              @click="selectEmployees"
              :disabled="status==='ready_for_processing'||status==='processing'"
              class="btn btn-outline-primary">
        <i class="fa fa-edit"></i>&nbsp;{{ $t('buttons.edit') }}</button>
    </div>
    <datatable v-bind="$data" sort-field="form_date" sort-desc="true"></datatable>
  </div>
</template>

<script>
import {EventBus} from '@/event-bus'
import components from './comps'

export default {
  components,
  props: {
    status: {
      type: String,
      default: 'disabled'
    },
    employees: {
      type: Array,
      default () {
        return []
      }
    },
    title: {
      type: String,
      default: ''
    }
    // @ onEmployeesAdded(employees)
    // @ onEmployeesRemove(employees)
  },
  data () {
    let vm = this
    return {
      selectedRecord: null,
      mode: 'list',
      columns: (() => {
        const cols = [
          {title: vm.$t('general.no'), field: 'recordNo', sortable: true, tdClass: 'text-center', thClass: 'text-center'},
          {title: vm.$t('general.name'), tdComp: 'DisplayName', tdClass: 'text-left', thClass: 'text-left'},
          {title: vm.$t('tax.joined_date'), tdComp: 'JoinedDate', thClass: 'text-enter', tdClass: 'text-center'},
          {title: vm.$t('general.status'), field: 'status', tdComp: 'Status'},
          {title: vm.$t('general.form'), tdComp: 'Form', tdClass: 'text-center', thClass: 'text-center'},
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
    EventBus.$on('onEmployeesSelected', vm.onEmployeesSelected)
    EventBus.$on('commencementEmployeeDeleted', vm.onCommencementEmployeeDeleted)
  },
  beforeDestroy () {
    EventBus.$off('onEmployeesSelected')
    EventBus.$off('commencementEmployeeDeleted')
  },
  methods: {
    onCommencementEmployeeDeleted (employee) {
      let vm = this
      // console.log('EmployeeTable :: onCommencementEmployeeDeleted')
      let options = {
        okText: vm.$t('buttons.ok'),
        cancelText: vm.$t('buttons.cancel')
      }
      vm.$dialog.confirm(vm.$t('messages.are_you_sure') + '?', options)
        .then(function () {
          vm.$emit('onEmployeesRemoved', [employee])
        })
        .catch(function () {
        })
    },
    onEmployeesSelected (employees) {
      this.$emit('onEmployeesUpdated', employees)
    },
    selectEmployees () {
      let vm = this
      // console.log('EmployeeTable :: selectEmployees :: vm.employees: ', vm.employees)
      let selectedEmployeeIds = vm.employees.map(formEmployee => formEmployee.employee_id.toString())
      // console.log('EmployeeTable :: selectEmployees :: selectedEmployeeIds: ', selectedEmployeeIds)

      // vm.$store.dispatch('SET_SELECTED_FORM_EMPLOYEE_IDS', selectedEmployeeIds)
      EventBus.$emit('showSelectEmployeeDialog', selectedEmployeeIds)
    },
    updateData () {
      let vm = this
      vm.data = vm.employees
      for (var i = 0; i < vm.data.length; i++) {
        vm.data[i].recordNo = i + 1
      }
      vm.total = vm.employees.length
    }
  },
  watch: {
    employees: {
      handler: function (value) {
        // let vm = this
        // console.log('watch(employees) handler :: value: ', value)
        // console.log('watch(employees) handler :: vm.employees: ', vm.employees)
        this.updateData()
        // console.log('watch(employees)')
      },
      deep: true
    },
    query: {
      handler (query) {
        this.updateData()
        // console.log('watch(query)')
      }
    }
  }
}
</script>

<style>
  .employee-table .table-title {
    position: absolute;
    left: 0;
  }
</style>
