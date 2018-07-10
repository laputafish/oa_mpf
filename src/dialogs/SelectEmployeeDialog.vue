<template>
  <b-modal :title="$t('messages.please_select_department_employee')"
           class="modal-primary"
           id="select-employee-dialog"
           size="lg"
           v-model="showingModal"
           @cancel="closeDialog"
           @ok="closeDialog">
    <div class="mb-1 d-flex flex-column">
      <div class="row form-group">
        <div class="col-sm-12 col-md-8">
          <div class="input-group">
            <input class="form-control" type="text" placeholder="按員工姓名搜索">
            <div class="input-group-append">
              <button type="button" class="btn btn-outline-primary">
                <i class="fa fa-close"></i></button>
            </div>
          </div>
        </div>
      </div>
      <div class="row flex-grow-1 d-flex flex-row">
        <div class="col-sm-6 align-items-stretch d-flex flex-column" style="height:450px;">
          <div class="tab-headers">
            <ul role="tablist" tabindex="0" class="nav nav-tabs">
              <li role="presentation" class="nav-item"
                  :class="{'bg-primary':tabIndex===0}">
                <a role="tab" tabindex="-1" href="#"
                   @click="tabIndex=0"
                   :class="{active:tabIndex===0}"
                   class="nav-link">員工
                </a>
              </li>
              <li role="presentation" class="nav-item"
                  :class="{'bg-primary':tabIndex===1}">
                <a role="tab" tabindex="-1" href="#"
                   @click="tabIndex=1"
                   :class="{active:tabIndex===1}"
                   class="nav-link">群組
                </a>
              </li>
            </ul>
          </div>
          <div class="flex-grow-1 selection-list-container" v-show="tabIndex===0">
            <employee-selection-item v-for="employee in availableEmployees"
                                     :key="employee.id"
                                     @onSelected="onEmployeeSelected"
                                     :employee="employee">
            </employee-selection-item>
          </div>
          <div class="flex-grow-1 selection-list-container" v-show="tabIndex===1">
            <span>
              lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd lksfjs flsdkj flsdkjf lksdj flsdkf jlsdkf klsd
            </span>
          </div>
        </div>
        <div class="col-sm-6 d-flex flex-column selected-item-column">
          <h6>{{ $t('general.selected') }}</h6>
          <div class="selected-item-container flex-grow-1">
            <employee-selection-item v-for="employee in selectedEmployees"
                                     :key="employee.id"
                                     @onSelected="onEmployeeRemoved"
                                     :employee="employee">
            </employee-selection-item>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import EmployeeSelectionItem from '@/components/EmployeeSelectionItem'

export default {
  components: {
    'employee-selection-item': EmployeeSelectionItem
  },
  data () {
    return {
      search: '',
      showingModal: false,
      selectedEmployeeIds: [],
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
    }
  },
  mounted () {
    let vm = this
    vm.showingModal = vm.showingDialog
  },
  watch: {
    showingDialog: function (value) {
      let vm = this
      vm.showingModal = vm.showingDialog
    },
    watch: {
      employees: function (value) {

      },
      groups: function (value) {

      }
    }
  },
  methods: {
    closeDialog () {
      this.$emit('close')
    },
    onEmployeeSelected (employee) {
      this.selectedEmployeeIds.push(employee.id)
    },
    onEmployeeRemoved (employee) {
      let index = this.selectedEmployeeIds.indexOf(employee.id)
      this.selectedEmployeeIds.splice(index, 1)
    }
  },
  computed: {
    employees () {
      return this.$store.getters.employees
    },
    groups () {
      return this.$store.getters.groups
    },
    availableEmployees () {
      let vm = this
      return this.employees.filter(employee => {
        return vm.selectedEmployeeIds.indexOf(employee.id) === -1
      })
    },
    selectedEmployees () {
      let vm = this
      return this.employees.filter(employee => {
        return vm.selectedEmployeeIds.indexOf(employee.id) !== -1
      })
    }
  }
}
</script>

<style>
#select-employee-dialog .modal-body {
  height: 520px;
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

#select-employee-dialog {
  height: 80%;
}

.selected-item-column {
  padding-top: 1.7rem;
  padding-left: 0;
}

.selection-list-container {
  border: 1px solid #dee2e6;
  height: 100%;
  overflow-y: scroll;
  padding: 5px;
}
.selected-item-column .selected-item-container {
  width: 100%;
  border: 1px solid #dee2e6;
}
</style>
