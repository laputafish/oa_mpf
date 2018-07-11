<template>
  <div style="position:relative;" class="employee-table">
    <div class="pull-left mt-2">
      <span>{{ title }}</span>
    </div>
    <div class="btn-group btn-group-gap" style="position:absolute;top:0;right:60px;">
      <button type="button"
              @click="startGeneration"
              :disabled="status==='generating'"
              class="btn btn-outline-success">
        <i class="fa fa-bolt"></i>&nbsp;{{ $t('buttons.generate_ir56e') }}</button>
      <button type="button"
              :disabled="status!=='generating'"
              @click="terminateGeneration"
              class="btn btn-outline-danger">
        <i class="fa fa-hand-stop-o"></i>&nbsp;{{ $t('buttons.terminate') }}</button>
      <button type="button"
              @click="selectEmployees"
              class="btn btn-outline-primary">
        <i class="fa fa-edit"></i>&nbsp;{{ $t('buttons.edit') }}</button>
    </div>
    <datatable v-bind="$data"></datatable>
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
    startGeneration () {
      alert('startGeneration')
    },
    terminateGeneration () {
      alert('terminate')
    },
    onCommencementEmployeeDeleted (employee) {
      let vm = this
      console.log('EmployeeTable :: onCommencementEmployeeDeleted')
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
      this.$emit('onEmployeesAdded', employees)
    },
    selectEmployees () {
      let vm = this
      let selectedEmployeeIds = vm.employees.map(employee => employee.id)
      vm.$store.dispatch('SHOW_SELECT_EMPLOYEE_DIALOG', selectedEmployeeIds)
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
        let vm = this
        console.log('watch(employees) handler :: value: ', value)
        console.log('watch(employees) handler :: vm.employees: ', vm.employees)
        this.updateData()
        console.log('watch(employees)')
      },
      deep: true
    },
    query: {
      handler (query) {
        this.updateData()
        console.log('watch(query)')
      }
    }
  }
}
</script>

<style>
</style>
