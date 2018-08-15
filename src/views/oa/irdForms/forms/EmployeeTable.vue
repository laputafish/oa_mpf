<template>
  <div style="position:relative;" class="employee-table">
    <div class="table-title">
      <div class="mt-2">{{ title }}</div>
    </div>
    <div class="table-toolbar btn-group btn-group-gap">
      <!--<button type="button"-->
              <!--@click="selectEmployees"-->
              <!--:disabled="status==='ready_for_processing'||status==='processing'"-->
              <!--class="btn btn-outline-primary">-->
        <!--<img class="pdf-icon" :src="pdfIcon"/>&nbsp;{{ $t('tax.record_verification_form') }}</button>-->

      <button type="button"
              @click="clearAll"
              :disabled="status==='ready_for_processing'||status==='processing'||tableEmployees.length===0"
              class="btn btn-outline-danger">
        <i class="fa fa-close"></i>&nbsp;{{ $t('buttons.clear_all') }}</button>
      <button type="button"
              @click="addAll"
              :disabled="status==='ready_for_processing'||status==='processing'"
              class="btn btn-outline-success">
        <i class="fa fa-edit"></i>&nbsp;{{ $t('buttons.quick_add') }}</button>
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
import * as constants from '@/store/constants'
import ThHeader from '@/components/datatable/ThHeader'

export default {
  components: {
    ...components,
    ThHeader
  },
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
    },
    formId: {
      type: Number,
      default: 0
    },
    isIR56: {
      type: Boolean,
      default: false
    }
    // @ onEmployeesAdded(employees)
    // @ onEmployeesRemove(employees)
  },
  data () {
    return {
      tableEmployees: [],
      selectedRecord: null,
      mode: 'list',
      columns: (() => {
        const cols = [
          {title: 'general.number', thComp: ThHeader, field: 'recordNo', tdClass: 'text-center', thClass: 'text-center'},
          {title: 'tax.sheet_no', thComp: ThHeader, tdComp: 'SheetNo', field: 'sheet_no', tdClass: 'text-center', thClass: 'text-center'},
          {title: 'general.name', thComp: ThHeader, field: 'name', sortable: true, tdClass: 'text-left', thClass: 'text-left'},
          {title: 'tax.joined_date', thComp: ThHeader, field: 'joinedDate', tdComp: 'JoinedDate', sortable: true, thClass: 'text-center', tdClass: 'text-center'},
          {title: 'general.status', thComp: ThHeader, field: 'status', sortable: true, tdComp: 'Status'},
          {title: 'general.form', thComp: ThHeader, field: 'form', tdComp: 'Form', tdClass: 'text-center', thClass: 'text-center'},
          {title: 'tax.operation', thComp: ThHeader, tdComp: 'Opt'}
        ]
        return cols
      })(),
      data: [],
      total: 0,
      query: {},
      xprops: {
        formId: this.getFormId
      }
    }
  },
  created () {
    let vm = this
    EventBus.$on('onEmployeesSelected', vm.onEmployeesSelected)
    EventBus.$on('onEmployeeDeleted', vm.onEmployeeDeleted)
    EventBus.$on('onEmployeeDocumentRequested', vm.onEmployeeDocumentRequested)
  },
  beforeDestroy () {
    EventBus.$off('onEmployeesSelected')
    EventBus.$off('onEmployeeDeleted')
    EventBus.$off('onEmployeeDocumentRequested')
  },
  computed: {
    getFormId () {
      return this.form.id
    },
    pdfIcon () {
      return constants.apiUrl + '/media/icons/defaults/pdf'
    }
  },
  methods: {
    onEmployeeDocumentRequested (employee) {
      let vm = this
      let employeeId = employee.employee_id
      let url = constants.apiUrl + '/forms/' + vm.formId + '/employee/' + employeeId + '/prepare'
      vm.axios.post(url).then(function (response) {
        if (response.data.status) {
          let key = response.data.key
          let downloadUrl = constants.apiUrl + '/temp/' + key + '/show'
          window.open(downloadUrl, '_blank')
        }
      })
    },
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
    addAll () {
      this.$emit('onEmployeesAllAdded')
    },
    clearAll () {
      let vm = this
      let options = {
        okText: vm.$t('buttons.ok'),
        cancelText: vm.$t('buttons.cancel')
      }
      vm.$dialog.confirm(vm.$t('messages.are_you_sure') + '?', options)
        .then(function () {
          vm.$emit('onEmployeesAllRemoved')
        })
        .catch(function () {
        })
    },
    selectEmployees () {
      let vm = this
      let selectedEmployeeIds = vm.employees.map(formEmployee => formEmployee.employee_id.toString())
      // EventBus.$emit('showSelectEmployeeDialog', selectedEmployeeIds)
      vm.$emit('onCommand', {
        command: 'selectEmployee',
        selectedEmployeeIds: selectedEmployeeIds
      })
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
        vm.tableEmployees[i].recordNo = i + 1
        if (query.sort !== '') {
          console.log('#' + i + ': ' + vm.tableEmployees[i][query.sort])
        }
        data.push(vm.tableEmployees[i])
      }
      vm.data = data
      vm.total = vm.tableEmployees.length
    },
    loadTableEmployees (value) {
      console.log('EmployeeTable :: loadTableEmployees :: value: ', value)
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
  .employee-table .pdf-icon {
    width: 16px;
    height: 16px;
  }
</style>
