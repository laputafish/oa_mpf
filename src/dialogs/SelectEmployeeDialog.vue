<template>
  <b-modal
    ref="selectEmployeeDialog"
    :title="$t('messages.please_select_department_employee')"
           class="modal-primary"
           id="select-employee-dialog"
           size="lg"
           cancelClass="btn-outline-primary"
           on-close-on-backdrop="false"
           @cancel="closeDialog"
           @ok="confirm">
    <div class="mb-1 d-flex flex-column">
      <div>
      </div>
      <div class="row form-group">
        <div class="col-sm-12 col-md-8">
          <div class="input-group">
            <input class="form-control" type="text" :placeholder="$t('general.search_in_name_order')">
            <div class="input-group-append">
              <button type="button" class="btn btn-outline-primary">
                <i class="fa fa-close"></i></button>
            </div>
          </div>
        </div>
        <div class="col-sm-4 col-md-4">
          <button type="button"
                  @click="onAllSelected"
                  class="pull-right btn btn-outline-primary">
            <i class="fa fa-plus"></i>&nbsp;{{ $t('buttons.add_all_employees') }}
          </button>
        </div>
      </div>
      <div class="row flex-grow-1 d-flex flex-row employee-selection-pane">
        <div class="col-sm-6 align-items-stretch d-flex flex-column">
          <b-tabs>
            <b-tab :active="tabIndex==0">
              <template slot="title">
                <i class="fa fa-user"></i>&nbsp;
                {{ $t('general.employee') }} ({{ availableEmployees.length }})
              </template>
              <employee-selection-item v-for="employee in availableEmployees"
                                       :key="employee.id"
                                       @onSelected="onEmployeeSelected"
                                       :employee="employee">
              </employee-selection-item>
            </b-tab>
            <b-tab :active="tabIndex===1">
              <template slot="title">
                <i class="fa fa-users"></i>&nbsp;
                {{ $t('general.group') }} ({{ availableGroups.length }})
              </template>
              <group-selection-item v-for="group in availableGroups"
                                       :key="group.id"
                                       @onSelected="onGroupSelected"
                                       :group="group">
              </group-selection-item>
            </b-tab>
          </b-tabs>
          <!--<div class="tab-headers">-->
            <!--<ul role="tablist" tabindex="0" class="nav nav-tabs">-->
              <!--<li role="presentation" class="nav-item"-->
                  <!--:class="{'bg-primary':tabIndex===0}">-->
                <!--<a role="tab" tabindex="-1" href="#"-->
                   <!--@click="tabIndex=0"-->
                   <!--:class="{active:tabIndex===0}"-->
                   <!--class="nav-link">員工-->
                <!--</a>-->
              <!--</li>-->
              <!--<li role="presentation" class="nav-item"-->
                  <!--:class="{'bg-primary':tabIndex===1}">-->
                <!--<a role="tab" tabindex="-1" href="#"-->
                   <!--@click="tabIndex=1"-->
                   <!--:class="{active:tabIndex===1}"-->
                   <!--class="nav-link">群組-->
                <!--</a>-->
              <!--</li>-->
            <!--</ul>-->
          <!--</div>-->
          <!--<div class="flex-grow-1 item-list-container" v-show="tabIndex===0">-->
            <!--<employee-selection-item v-for="employee in availableEmployees"-->
                                     <!--:key="employee.id"-->
                                     <!--@onSelected="onEmployeeSelected"-->
                                     <!--:employee="employee">-->
            <!--</employee-selection-item>-->
          <!--</div>-->
          <!--<div class="flex-grow-1 item-list-container" v-show="tabIndex===1">-->
            <!--<span>-->
              <!--lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd-->
            <!--</span>-->
          <!--</div>-->
        </div>
        <div class="col-sm-6 d-flex flex-column selected-item-column">
          <h6>{{ $t('general.selected') }} {{ selectedCountLabel }}</h6>
          <div class="item-list-container flex-grow-1">
            <div v-if='allSelected'
                 class="p-1 group-selection-item pb-1 pointer d-flex flex-row align-items-start"
                 @click="onAllRemoved">
              <span>{{ $t('general.all_employees') }}</span>
            </div>
            <employee-selection-item
              v-if="!allSelected"
              v-for="employee in selectedEmployees"
              :key="employee.id"
              @onSelected="onEmployeeRemoved"
              :employee="employee">
            </employee-selection-item>
            <group-selection-item
              v-if="!allSelected"
              v-for="group in selectedGroups"
              :key="group.id"
              @onSelected="onGroupRemoved"
              :group="group">
            </group-selection-item>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import {EventBus} from '@/event-bus'
import EmployeeSelectionItem from '@/components/EmployeeSelectionItem'
import GroupSelectionItem from '@/components/GroupSelectionItem'

export default {
  components: {
    'employee-selection-item': EmployeeSelectionItem,
    'group-selection-item': GroupSelectionItem
  },
  data () {
    return {
      allSelected: false,
      search: '',
      showingModal: false,
      selectedEmployeeIds: [],
      selectedGroupIds: [],
      tabIndex: 0
    }
  },
  model: {
    prop: 'showingDialog',
    event: 'ok'
  },
  props: {
    showingDialog: {
      type: Boolean,
      default: false
    },
    defaultSelectedEmployeeIds: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  mounted () {
    let vm = this
    //     vm.showingModal = vm.showingDialog
    //     if (vm.showingModal) {
    // //       alert('mounted :: showingModal')
    //       vm.$refs.selectEmployeeDialog.show()
    //     } else {
    // //       alert('mounted :: not showingModal')
    //       vm.$refs.selectEmployeeDialog.hide()
    //     }
    vm.selectedEmployeeIds = JSON.parse(JSON.stringify(vm.defaultSelectedEmployeeIds))
  },
  watch: {
    //     showingDialog: function (value) {
    //       let vm = this
    //       if (this.showingModal) {
    // //        alert('watch(showingModal) :: true')
    //         vm.$refs.selectEmployeeDialog.show()
    //       } else {
    // //        alert('watch(showingModal) :: false')
    //         vm.$refs.selectEmployeeDialog.hide()
    //       }
    //       // this.showingModal = value
    //     },
    defaultSelectedEmployeeIds: function (value) {
      this.selectedEmployeeIds = JSON.parse(JSON.stringify(value))
    },
    selectedEmployeeIds: function (value) {
      let vm = this
      console.log('SelectEmployeeDialog :: watch(selectedEmployeeIds) => forceUpdate: ', value)
      console.log('SelectEmployeeDialog :: watch(selectedEmployeeIds) => forceUpdate: ', vm.selectedEmployeeIds)
      vm.$nextTick().then(() => {
        vm.$forceUpdate()
      })
    },
    selectedGroupIds: function (value) {
    }
  },
  methods: {
    show () {
      console.log('SelectEmployeeDialog :: show()')
      this.$refs.selectEmployeeDialog.show()
    },
    confirm () {
      console.log('confirm')
      let vm = this
      let employees = []
      let i, j
      let groupEmployee
      let selectedGroup

      if (vm.allSelected) {
        employees = vm.employees
      } else {
        for (i = 0; i < vm.selectedEmployees.length; i++) {
          employees.push(vm.selectedEmployees[i])
        }
        let selectedEmployeeIds = employees.map(employee => employee.id)
        for (i = 0; i < vm.selectedGroups.length; i++) {
          selectedGroup = vm.selectedGroups[i]
          for (j = 0; j < selectedGroup.employees.length; j++) {
            groupEmployee = selectedGroup.employees[i]
            if (selectedEmployeeIds.indexOf(groupEmployee.id) === -1) {
              employees.push(groupEmployee)
            }
          }
        }
      }
      console.log('confirm => $emit( onEmployeesSelected )')
      EventBus.$emit('onEmployeesSelected', employees)
      this.$emit('close')
    },
    closeDialog () {
      this.$refs.selectEmployeeDialog.hide()
      // this.$emit('close')
    },
    onAllSelected () {
      let vm = this
      vm.allSelected = true
      vm.selectedEmployeeIds = []
      vm.selectedGroupIds = []
      vm.$nextTick().then(() => {
        vm.$forceUpdate()
      })
    },
    onAllRemoved () {
      this.allSelected = false
    },
    onEmployeeSelected (employee) {
      console.log('SelectEmployeeDialog :: onEmployeeSelected')
      let vm = this
      if (!vm.allSelected) {
        console.log('SelectEmployeeDialog :: not all selected')
        vm.selectedEmployeeIds.push(employee.id)
        console.log('SelectEmployeeDialog :: pushed employee id')
        vm.$nextTick().then(() => {
          console.log('SelectEmployeeDialog $nextTick => forceUpdate')
          vm.$forceUpdate()
        })
      }
    },
    onEmployeeRemoved (employee) {
      let vm = this
      let index = vm.selectedEmployeeIds.indexOf(employee.id)
      vm.selectedEmployeeIds.splice(index, 1)
      vm.$nextTick().then(() => {
        vm.$forceUpdate()
      })
    },
    onGroupSelected (group) {
      let vm = this
      if (!vm.allSelected) {
        vm.selectedGroupIds.push(group.id)
        vm.$nextTick().then(() => {
          vm.$forceUpdate()
        })
      }
    },
    onGroupRemoved (group) {
      let vm = this
      let index = vm.selectedGroupIds.indexOf(group.id)
      vm.selectedGroupIds.splice(index, 1)
      vm.$nextTick().then(() => {
        vm.$forceUpdate()
      })
    }
  },
  computed: {
    employees () {
      return this.$store.getters.employees
    },
    availableEmployees () {
      let vm = this
      return this.employees.filter(employee => {
        return vm.selectedEmployeeIds.indexOf(employee.id) === -1
      })
    },
    selectedEmployees () {
      let vm = this
      console.log('SelectEmployeeDialog :: employees.length = ' + vm.employees.length)
      console.log('SelectEmployeeDialog :: selectedEmployeeIds: ', vm.selectedEmployeeIds)
      let employees = this.employees.filter(employee => {
        return vm.selectedEmployeeIds.indexOf(employee.id) !== -1
      })
      console.log('computed :: selectedEmployees: ', employees)
      return employees
    },

    groups () {
      return this.$store.getters.groups
    },
    availableGroups () {
      let vm = this
      return this.groups.filter(group => {
        return vm.selectedGroupIds.indexOf(group.id) === -1
      })
    },
    selectedGroups () {
      let vm = this
      return this.groups.filter(group => {
        return vm.selectedGroupIds.indexOf(group.id) !== -1
      })
    },
    selectedCountLabel () {
      let vm = this
      let segs = []
      if (!vm.allSelected) {
        if (vm.selectedEmployeeIds.length > 0) {
          segs.push(vm.selectedEmployeeIds.length + ' ' + vm.$t('general.employee'))
        }
        if (vm.selectedGroupIds.length > 0) {
          segs.push(vm.selectedGroupIds.length + ' ' + vm.$t('general.group'))
        }
      }
      return (segs.length > 0)
        ? '(' + segs.join(', ') + ')'
        : ''
    }
  }
}
</script>

<style>
#select-employee-dialog .modal-body {
  height: 520px;
}

#select-employee-dialog .modal-body .tab-content > div {
  height: 390px;
  padding: 0.5rem;
  overflow-y: auto;
}

#select-employee-dialog .employee-selection-pane > div {
  height: 433px;
}

#select-employee-dialog .tab-headers {
  padding-top: 10px;
}
#select-employee-dialog .tab-headers .nav-tabs li {
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  border-radius: 0;
  border: 2px solid white;
}

#select-employee-dialog .tab-headers .nav-tabs li a.active {
  color: white;
}

#select-employee-dialog .tab-headers .nav-tabs li a {
  background-color: transparent;
  border: none;
}

/*#select-employee-dialog {*/
  /*height: 80%;*/
/*}*/

.selected-item-column {
  padding-top: 0.9rem;
  padding-left: 0;
}

#select-employee-dialog .item-list-container {
  border: 1px solid #dee2e6;
  height: 100%;
  overflow-y: scroll;
  padding: 5px;
}

.selected-item-column .selected-item-container {
  width: 100%;
  border: 1px solid #dee2e6;
  height: 433px;
}
</style>
