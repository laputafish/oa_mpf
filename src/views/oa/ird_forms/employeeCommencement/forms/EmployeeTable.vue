<template>
  <div style="position:relative;" class="employee-table">
    <div class="pull-left mt-2">
      <span>{{ title }}</span>
    </div>
    <div class="btn-group" style="position:absolute;top:0;right:60px;">
      <button type="button"
              @click="selectEmployees"
              class="btn btn-primary">{{ $t('buttons.add') }}</button>
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
          {title: vm.$t('general.name'), field: 'displayName'},
          {title: vm.$t('tax.joined_date'), tdComp: 'JoinedDate', thClass: 'text-center'},
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
    EventBus.$on('employeesSelected', vm.onEmployeesSelected)
    EventBus.$on('commencementEmployeeDeleted', vm.onCommencementEmployeeDeleted)
  },
  beforeDestroy () {
    EventBus.$off('employeesSelected')
    EventBus.$off('commencementEmployeeDeleted')
  },
  methods: {
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
      vm.$store.dispatch('SHOW_SELECT_EMPLOYEE_DIALOG')
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
