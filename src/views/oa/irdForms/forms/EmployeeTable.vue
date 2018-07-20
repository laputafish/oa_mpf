<template>
  <div style="position:relative;" class="employee-table">
    <div class="table-title">
      <div class="mt-2">{{ title }}</div>
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
      tableEmployees: [],
      selectedRecord: null,
      mode: 'list',
      columns: (() => {
        const cols = [
          {title: vm.$t('general.no'), field: 'recordNo', tdClass: 'text-center', thClass: 'text-center'},
          {title: vm.$t('general.name'), field: 'name', sortable: true, tdClass: 'text-left', thClass: 'text-left'},
          {title: vm.$t('tax.joined_date'), field: 'joinedDate', tdComp: 'JoinedDate', sortable: true, thClass: 'text-center', tdClass: 'text-center'},
          {title: vm.$t('general.status'), field: 'status', sortable: true, tdComp: 'Status'},
          {title: vm.$t('general.form'), field: 'form', tdComp: 'Form', tdClass: 'text-center', thClass: 'text-center'},
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
    EventBus.$on('onEmployeeDeleted', vm.onEmployeeDeleted)
  },
  beforeDestroy () {
    EventBus.$off('onEmployeesSelected')
    EventBus.$off('onEmployeeDeleted')
  },
  methods: {
    onEmployeeDeleted (employee) {
      let vm = this
      // console.log('EmployeeTable :: onEmployeeDeleted')
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
      let selectedEmployeeIds = vm.employees.map(formEmployee => formEmployee.employee_id.toString())
      EventBus.$emit('showSelectEmployeeDialog', selectedEmployeeIds)
    },
    updateData (query) {
      let vm = this
      if (typeof query === 'undefined') {
        query = vm.query
      }
      console.log('updateData: query: ', query)
      let lastIndex = query.offset + query.limit - 1
      if (lastIndex >= vm.tableEmployees.length) {
        lastIndex = vm.tableEmployees.length - 1
      }

      // Sort
      if (query.sort !== '') {
        // let needSwap = query.order === 'asc' ? -1 : 1
        // let noSwap = -(needSwap)
        console.log('sort begins: tableEmployees: ', vm.tableEmployees)
        vm.tableEmployees = vm.tableEmployees.sort(function (employee1, employee2) {
          console.log('sort :: compare:: employee1: ', employee1)
          console.log('sort :: compare:: employee2: ', employee2)
          console.log('sort :: compare:: employee1[query.sort] = ' + employee1[query.sort])
          console.log('sort :: compare:: employee2[query.sort] = ' + employee2[query.sort])
          console.log('sort :: compare:: ' +
            employee1[query.sort] +
            ' < ' + employee2[query.sort] +
            ': ' + (employee1[query.sort] < employee2[query.sort] ? 'true' : 'false')
          )

          if (query.order === 'asc') {
            return employee1[query.sort] < employee2[query.sort] ? -1 : 1
          } else {
            return employee1[query.sort] < employee2[query.sort] ? 1 : -1
          }
        })
        console.log('sort ends: tableEmployees: ', vm.tableEmployees)
      }

      let data = []
      for (var i = query.offset; i <= lastIndex; i++) {
        vm.tableEmployees[i].recordNo = query.offset + i + 1
        if (query.sort !== '') {
          console.log('#' + i + ': ' + vm.tableEmployees[i][query.sort])
        }
        data.push(vm.tableEmployees[i])
      }
      vm.data = data
      vm.total = vm.tableEmployees.length
    },
    loadTableEmployees (value) {
      this.tableEmployees = []
      for (var i = 0; i < value.length; i++) {
        this.tableEmployees.push(value[i])
      }
      console.log('loadTableEmployees: result: ', this.tableEmployees)
    }
  },
  watch: {
    employees: {
      handler: function (value) {
        // let vm = this
        // console.log('watch(employees) handler :: value: ', value)
        // console.log('watch(employees) handler :: vm.employees: ', vm.employees)
        console.log('watch(employees) >> force reload')
        this.loadTableEmployees(value)
        this.updateData()
        // console.log('watch(employees)')
      }
    },
    query: {
      handler (query) {
        console.log('watch(query)')
        this.updateData(query)
        // console.log('watch(query)')
      },
      deep: true
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
