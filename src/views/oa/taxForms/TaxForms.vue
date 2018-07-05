<template>
  <div class="tax-forms animated fadeIn mx-3"
       @mouseover="onMouseOverBlank">
    <div class="row">
      <div class="col-sm-3">
        <h2>{{ (typeof $t === 'function') ? $t('tax.tax_forms') : 'not defined' }}</h2>
      </div>
      <div class="col-sm-9 text-right" style="
">
        <div class="pull-right">
          <table style="height:46px;">
            <tbody>
            <tr>
              <td style="padding:0;">
                <div
                  v-if="generatingTaxForms"
                  style="width: 240px; text-align: center; display: inline-block;">
                  <small>{{ generatingProgressBar.title }}</small>
                  <div class="progress" style="position:relative;">
                    <div class="progress-bar progress-bar-animated progress-bar-striped"
                      :style="generatingProgressBar.style">
                    </div>
                    <div style="position:absolute;width:100%;height:100%;top:0;left:0;text-align:center;">
                      {{ generatingProgressBar.caption }}
                    </div>
                  </div>
                </div>
              </td>
              <td style="padding:0;">
                <button type="button" class="ml-1 btn-width-80 btn btn-default"
                        @click="toggleAll">
                  <i class="fa fa-check-square mr-1"></i>/<i class="fa fa-square"></i></button>
                <button type="button" class="ml-1 btn-width-80 btn btn-default"
                        @click="removeTaxForms">
                  <i class="fa fa-close"></i></button>
                <button type="button" class="ml-1 btn-width-80 btn btn-default"
                        @click="generateTaxForms">
                  <i class="fa fa-play"></i></button>
                <button type="button" class="ml-1 btn-width-80 btn btn-default"
                        @click="showTaxFormSettingsDialog">
                  <i class="fa fa-gear"></i></button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="d-flex flex-row mb-3">
      <button type="button"
              @click="onPrevYearClicked"
              class="btn-width-50 btn-sm btn btn-default pull-left">
        <i class="fa fa-caret-left"></i>
      </button>

      <div ref="yearlyWrapper" id="yearly-wrapper" class="yearly-scroller-wrapper">
        <yoov-radio-buttons
          @moveToLast="onYearlysInit"
          ref="yearlyBox"
          id="yearly-box"
          class="flex-grow-1 yearly-scroller"
          :buttons="yearlys"
          :labelField="'title'"
          :valueField="'year'"
          :selectedValue="selectedFiscalYear"
          @click="onYearlySelected"></yoov-radio-buttons>
      </div>

      <button type="button" @click="onNextYearClicked" class="btn-width-50 btn-sm btn btn-default pull-right">
        <i class="fa fa-caret-right"></i>
      </button>
    </div>
    <div class="d-flex flex-row">
      <ul class="hierarchical-group-list flex-grow-0">
        <group-hierarchical-item
          :groupItem="group"
          @onGroupSelected="onGroupSelectedHandler"
          v-for="(group, index) in groups"
          :selectedGroup="selectedGroup"
          :key="index"></group-hierarchical-item>
      </ul>
      <div class="flex-grow-1">
        <div class="d-flex flex-column">
          <div class="flex-grow-0" v-if="groups[0].length>0">
            <div class="input-group">
              <input class="form-control ng-untouched ng-pristine ng-valid"
                     v-model="searchEmployee"
                     type="text" placeholder="搜索員工">
              <div class="input-group-append">
                <button class="btn btn-default" type="button"
                        @click="searchEmployee=''">
                  <i class="fa fa-close fa-fw"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="flex-grow-1">
            <div class="employee-item mr-1 mb-1"
                 :class="{'selected':selectedEmployeeIds.indexOf(employee.id)>=0, 'selecting':selectingEmployeeIds.indexOf(employee.id)>=0}"
                 v-for="employee in employees"
                 :key="employee.id">
              <div class="d-flex flex-column align-items-center">
                <div class="d-flex flex-row">
                  <div class="selection-box-column d-flex flex-column justify-content-center align-items-center">
                    <button type="button"
                            :class="{'btn-yellow':activeEmployeeId==employee.id,'btn-default':activeEmployeeId!=employee.id}"
                            class="btn btn-sm btn-default"
                            @click="toggleEmployee(employee)"
                            style="margin-bottom: 0.5rem;">
                      <i class="fa"
                         :class="{'fa-check-square':employeeSelected(employee), 'fa-square':!employeeSelected(employee)}"
                      ></i>
                    </button>
                    <button type="button"
                            @click="toggleEmployeeRange(employee)"
                            @mouseover.stop="onMouseOverEmployee(employee)"
                            class="btn btn-sm btn-default">
                      <i class="fa fa-circle"></i>
                    </button>
                  </div>
                  <div class="employee-content d-flex flex-column align-items-center"
                       @click="toggleEmployee(employee)">
                    <img class="employee-avatar" :src="getAvatar(employee)"/>
                  </div>
                  <div class="employee-document-column d-flex flex-column align-items-center justify-content-center">
                    <div class="document-icon">
                      <img v-if="employeeIdsWithTaxForm && employeeIdsWithTaxForm.indexOf(employee.id)>=0"
                           :src="mediaUrl + '/defaults/tax_form_ready'"/>
                      <img v-else
                           :src="mediaUrl + '/defaults/tax_form_not_ready'"/>
                    </div>
                    <button type="button" class="btn-generate btn btn-sm btn-success">
                      <i class="fa fa-fw fa-play"></i>
                    </button>
                  </div>
                </div>
                <small class="employee-name">{{ employee.displayName }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <tax-form-settings-dialog
      @submit="saveTaxFormSettings"
      @close="showingTaxFormSettingsDialog=false"
      v-show="showingTaxFormSettingsDialog">
    </tax-form-settings-dialog>
  </div>
</template>

<script>
import GroupHierarchicalItem from '@/views/components/GroupHierarchicalItem'
import TaxFormSettingsDialog from '@/dialogs/TaxFormSettingsDialog'
import YoovRadioButtons from '@/components/YoovRadioButtons'
import constants from '@/store/constants.json'
import Pusher from 'pusher-js' // import Pusher

export default {
  components: {
    'group-hierarchical-item': GroupHierarchicalItem,
    'yoov-radio-buttons': YoovRadioButtons,
    'tax-form-settings-dialog': TaxFormSettingsDialog
  },
  data () {
    return {
      pusherSubscribed: false,
      generatingTaxForms: false,
      showingTaxFormSettingsDialog: false,
      selectedFiscalYear: '',
      searchEmployee: '',
      yearlys: [],
      generatingProgressBar: {
        title: '',
        value: 0,
        max: 0
      }
    }
  },
  computed: {
    employeeIdsWithTaxForm () {
      return this.$store.employeeIdsWithTaxForm
    },
    teamId () {
      return this.$store.getters.teamId
    },
    payrolls () {
      return this.$store.getters.payrolls
    },
    selectingEmployeeIds () {
      return this.$store.getters.selectingEmployeeIds
    },
    hoveringEmployeeId () {
      return this.$store.getters.hoveringEmployeeId
    },
    selectedEmployeeIds () {
      return this.$store.getters.selectedEmployeeIds
    },
    allEmployeesSelected () {
      let vm = this
      let result = false
      if (vm.selectedGroup) {
        if (vm.selectedGroup.id === 0) {
          result = vm.$store.getters.isAllEmployeesSelected
        } else {
          result = vm.$store.getters.isAllGroupEmployeesSelected
        }
      }
      return result
    },
    mediaUrl () {
      return constants.mediaUrl
    },
    groups () {
      return this.$store.getters.groupTree
    },
    employees () {
      return this.$store.getters.employees
    },
    user () {
      return this.$store.getters.user
    },
    activeEmployeeId () {
      return this.$store.getters.activeEmployeeId
    },
    selectedGroup () {
      return this.$store.getters.selectedGroup
      // let vm = this
      // if (vm.groups.length === 0) {
      //   return null
      // } else {
      //   if (vm.storedSelectedGroup === null || vm.storedSelectedGroup.id === 0) {
      //     vm.storedSelectedGroup = vm.groups[0]
      //   }
      //   return vm.storedSelectedGroup
      // }
    }
  },
  watch: {
    // yearlys: function (val) {
    //
    // },
    selectedFiscalYear: function (val) {
      this.loadTaxForms()
    },
    selectedGroup: function (val) {
      this.$store.dispatch('CLEAR_EMPLOYEE_SELECTION')
      // this.selectedEmployeeIds = []
    },
    groups: {
      handler: function (val) {
        this.initSelectedGroup()
        // this.$store.dispatch('SELECT_GROUP', val[0])
        // alert('watch(groups)')
        // if (this.$store.selectedGroup === null) {
        // }

        // let vm = this
        // if (vm.selectedGroup === null) {
        //   vm.selectedGroup = vm.groups[0]
        // }
        // console.log('TaxForms.vue :: watch(groups) groups:', val)
      },
      deep: true
    },
    employees: function (val) {
      console.log('TaxForms.vue :: watch(employees) employees:', val)
    },
    user: function (val) {
      let vm = this
      console.log('TaxForms.vue :: watch(user) user:', val)
      vm.$store.dispatch('FETCH_GROUPS')
    },
    teamId: function (val) {
      let vm = this
      this.loadPayrolls()
      if (vm.pusherSubscribed) {
        this.unSubscribe()
      }
      this.subscribe()
    }
  },

  mounted () {
    let vm = this
    vm.loadPayrolls()
    this.initSelectedGroup()
    // let vm = this
    // if (vm.user && vm.user.oa_last_team_id) {
    //   this.$store.dispatch('FETCH_GROUPS').then(function () {
    //     vm.selectedGroup = vm.groups[0]
    //   })
    //   this.$store.dispatch('FETCH_EMPLOYEES')
    // }
    // let vm = this
    // vm.groups = [
    //   {
    //     name: vm.$t('general.all_staff'),
    //     children: [
    //       {name: 'Administration Team'},
    //       {name: 'Marketing Team'},
    //       {name: 'Accounting Team'},
    //       {name: 'Sales Team'},
    //       {
    //         name: 'Technical Team',
    //         children: [
    //           {name: 'Mobile Apps Development Team'},
    //           {name: 'Web Development Team'},
    //           {name: 'Desktop Development Team'}
    //         ]
    //       },
    //       {name: 'Management Team'}
    //     ]
    //   }
    // ]
    // vm.selectedGroup = vm.groups[0]
  },
  created () {
    let vm = this
    if (vm.itemId) {
      vm.subscribe()
    }
  },
  beforeDestroy () {
    this.unSubscribe()
  },
  methods: {
    updateProgressBar (value) {
      let vm = this
      let percentageValue = Math.floor(100 * value / vm.generatingProgressBar.max)
      let percentageStr = percentageValue + '%'
      vm.generatingProgressBar.style = {width: percentageStr}
      vm.generatingProgressBar.caption = percentageStr
    },

    updateProgress (data) {
      let vm = this
      let value = data.index * 2
      if (data.item.status === 'processing') {
        value -= 1
      }
      vm.updateProgressBar(value)
    },

    subscribe () {
      let vm = this
      if (vm.itemId) {
        vm.pusher = new Pusher('646e36da78e4db3ea81a', {cluster: 'ap1'})
        vm.pusher.subscribe('team_' + vm.itemId)
        vm.pusher.bind('new_job', data => {
          console.log('new_job :: data:', data)
        })
        vm.pusher.bind('tax_form_status_updated', data => {
          alert('tax_form_status_updated')
          vm.updateProgress(data)
        })
        vm.pusherSubscribed = true
      }
    },

    unSubscribe () {
      if (this.pusher) {
        this.pusher.disconnect()
      }
    },

    loadTaxForms () {
      this.$store.dispatch('FETCH_TAX_FORMS', this.selectedFiscalYear)
    },
    getYearlyList (startedDate, endedDate) {
      let vm = this
      if (startedDate > endedDate) {
        let tmp = startedDate
        startedDate = endedDate
        endedDate = tmp
      }

      // Get last fiscal year
      let lastFiscalYear
      let today = vm.$moment()
      let fiscalYearEnd = today.format('YYYY') + '-03-31'
      if (today.format('YYYY-MM-DD') < fiscalYearEnd) {
        lastFiscalYear = today.year() - 2
      } else {
        lastFiscalYear = today.year() - 1
      }

      // Get first fiscal year
      let firstFiscalYear
      let startedDateMoment = vm.$moment(startedDate)
      let startedDateYear = startedDateMoment.year()
      if (startedDateMoment.format('YYYY-MM-DD') < startedDateYear + '-03-31') {
        firstFiscalYear = startedDateYear - 1
      } else {
        firstFiscalYear = startedDateYear
      }

      vm.yearlys = []

      for (var year = firstFiscalYear; year <= lastFiscalYear; year++) {
        vm.yearlys.push({
          year: year.toString(),
          title: year.toString().substr(-2) + '/' + (year + 1).toString().substr(-2),
          selected: false
        })
      }
      vm.selectedFiscalYear = lastFiscalYear.toString()
    },
    loadPayrolls () {
      let vm = this
      this.$store.dispatch('FETCH_PAYROLLS').then(function () {
        console.log('loadPayrolls FETCH_PAYROLLS.then: vm.payrolls: ', vm.payrolls)
        if (vm.payrolls.length > 0) {
          let startedDate = vm.payrolls[0].startedDate
          let endedDate = vm.payrolls[vm.payrolls.length - 1].endedDate
          vm.getYearlyList(startedDate, endedDate)
        } else {
          vm.yearlys = []
          vm.selectedFiscalYear = ''
        }
      })
    },
    showTaxFormSettingsDialog () {
      let vm = this
      vm.$store.dispatch('FETCH_INCOME_PARTICULARS').then(function () {
        vm.showingTaxFormSettingsDialog = true
      })
    },
    saveTaxFormSettings (params) {
      let vm = this
      let callback = params.callback
      vm.$store.dispatch('UPDATE_INCOME_PARTICULARS', params.data).then(function (response) {
        if (typeof callback === 'function') {
          callback(response)
        }
      })
    },

    initProgressBar (job, total) {
      console.log('initProgressBar job: ', job)
      console.log('initProgressBar total: ' + total)
      let vm = this
      vm.generatingTaxForms = job.status === 'pending' && total > 0
      if (total > 0) {
        vm.prepareProgressBar(total)
      }
    },

    prepareProgressBar (total) {
      let vm = this
      vm.generatingProgressBar.title = vm.$t('general.generating_')
      vm.generatingProgressBar.value = 1
      vm.generatingProgressBar.max = total * 2
      vm.generatingProgressBar.caption = '0%'
      vm.generatingProgressBar.style = {width: '0%'}
    },

    generateTaxForms () {
      let vm = this
      this.$store.dispatch('GENERATE_SELECTED_TAX_FORMS', this.selectedFiscalYear).then(function (response) {
        if (response.status) {
          let job = response.job
          let total = response.total
          vm.initProgressBar(job, total)
        }
      })
    },

    removeTaxForms () {

    },

    toggleEmployeeRange (employee) {
      this.$store.dispatch('TOGGLE_TO_EMPLOYEE', employee.id)
    },
    onMouseOverBlank () {
      this.$store.commit('setHoveringEmployeeId', -1)
    },
    onMouseOverEmployee (employee) {
      this.$store.commit('setHoveringEmployeeId', employee.id)
    },
    initSelectedGroup () {
      let vm = this
      vm.$store.dispatch('SELECT_GROUP', vm.groups[0])
    },
    toggleAll () {
      let vm = this
      if (vm.selectedGroup) {
        // all employess
        if (vm.$store.getters.isAllEmployeesSelected) {
          vm.$store.dispatch('CLEAR_EMPLOYEE_SELECTION')
        } else {
          vm.$store.dispatch('SELECT_ALL_EMPLOYEES')
        }
      }
    },
    employeeSelected (employee) {
      return this.selectedEmployeeIds.indexOf(employee.id) >= 0
    },
    toggleEmployee (employee) {
      this.$store.dispatch('TOGGLE_EMPLOYEE_SELECTION', employee)
    },
    getAvatar (employee) {
      // let vm = this
      if (employee.avatar) {
        return employee.avatarUrl
      } else {
        return constants.oaApiHost + employee.avatarUrl
      }
    },
    onGroupSelectedHandler (group) {
      this.$store.dispatch('SELECT_GROUP', group)
      // console.log('TaxForms :: onGroupSelectedHandler :: group: ', group)
      // this.storedSelectedGroup = group
    },
    onYearlySelected (yearlyItem) {
      let vm = this
      vm.selectedFiscalYear = yearlyItem.year
    },
    onPrevYearClicked () {
      let vm = this
      let yearlyBox = vm.$refs.yearlyBox
      yearlyBox.$el.scrollLeft -= 100
    },
    onNextYearClicked () {
      let vm = this
      let yearlyBox = vm.$refs.yearlyBox
      yearlyBox.$el.scrollLeft += 100
    },
    onYearlysInit () {
      let vm = this
      let yearlyBox = vm.$refs.yearlyBox
      // let yearlyWrapper = vm.$refs.yearlyWrapper
      yearlyBox.$el.scrollLeft = window.innerWidth // yearlyWrapper.style.width
    }
  }
}
</script>

<style>
  #yearly-wrapper {
    background-color: rgba(221, 221, 221, 0.6);
  }

  #yearly-box {
    text-align: center;
  }

  .hierarchical-group-list li {
    margin: 0;
  }

  .hierarchical-group-list li div {
    padding: 5px 10px;
    border-radius: 5px;
  }

  .yearly-scroller-wrapper {
    overflow: hidden;
    position: relative;
    width: 100%;
  }

  .yearly-scroller {
    white-space: nowrap;
    overflow-x: scroll;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: -17px;
  }

  .employee-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50rem;
  }

  .employee-item:hover,
  .employee-item.selecting {
    background-color: rgba(221, 221, 221, 0.6);
  }

  .employee-item.selected {
    background-color: #28ADA7;
    /* highlight #1E847F !important */
    color: white;
  }

  .employee-item.selected:hover {
    background-color: #1E847F;
  }

  .employee-item:hover .selection-box-column,
  .employee-item.selected .selection-box-column {
    visibility: visible;
  }

  .employee-document-column .btn-generate {
    display: none;
    margin-top: 0.1rem;
    height: 1.8rem;
  }

  .employee-item:hover .employee-document-column .btn-generate {
    display: block;
  }

  .employee-content {
    width: 84px;
  }

  .employee-name {
    overflow-x: hidden;
    text-align: center;
  }

  .selection-box-column {
    visibility: hidden;
    padding-right: 0.5rem;
  }

  .selection-box-column button {
    /*margin: 0 0.5rem 0.5rem 0;*/
  }

  .employee-item {
    width: auto;
    padding: 0.5rem;
    display: inline-block;
    border-radius: 0.5rem;
  }

  .document-icon img {
    width: 48px;
    height: 48px;
  }

  .tax-forms .btn-yellow {
    background-color: yellow;
  }

  .tax-forms .employee-content {
    cursor: pointer;
  }
</style>
