<template>
  <div class="tax-forms animated fadeIn mx-3">
    <div class="row">
      <div class="col-sm-12">
        <button type="button" class="pull-right btn-width-80 btn btn-default">
          <i class="fa fa-gear"></i>
        </button>
        <h2>{{ (typeof $t === 'function') ? $t('tax.tax_forms') : 'not defined' }}</h2>
      </div>
    </div>
    <div class="d-flex flex-row mb-3">
      <button type="button" @click="onPrevYearClicked" class="btn-width-50 btn-sm btn btn-default pull-left">
        <i class="fa fa-caret-left"></i>
      </button>

      <div ref="yearlyWrapper" id="yearly-wrapper" class="yearly-scroller-wrapper">
        <yoov-radio-buttons
            @moveToLast="onYearlysInit"
            ref="yearlyBox"
            id="yearly-box"
            class="flex-grow-1 yearly-scroller"
            :buttons="yearlys"
            :fieldName="'title'"
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
          <div class="flex-grow-0">
            <input class="form-control ng-untouched ng-pristine ng-valid" type="text" placeholder="搜索員工">
          </div>
          <div class="flex-grow-1">
            <div class="employee-item"
                 v-for="employee in employees"
                 :key="employee.id">
              <div class="d-flex flex-column align-items-center">
                <div class="d-flex flex-row">
                  <div class="selection-box-column d-flex flex-column justify-content-center align-items-center">
                    <button type="button"
                      class="btn btn-sm btn-default"
                      style="margin-bottom: 0.5rem;">
                      <i class="fa fa-square"></i>
                    </button>
                    <button type="button"
                    class="btn btn-sm btn-default">
                      <i class="fa fa-check-square"></i>
                    </button>
                  </div>
                  <div class="employee-content d-flex flex-column align-items-center">
                    <img class="employee-avatar" :src="getAvatar(employee)"/>
                  </div>
                  <div class="employee-document-column d-flex flex-column align-items-center justify-content-center">
                    <div class="document-icon">
                      <img :src="mediaUrl + '/defaults/pdf'"/>
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
  </div>
</template>

<script>
import GroupHierarchicalItem from '@/views/components/GroupHierarchicalItem'
import YoovRadioButtons from '@/components/YoovRadioButtons'
import constants from '@/store/constants.json'

export default {
  components: {
    'group-hierarchical-item': GroupHierarchicalItem,
    'yoov-radio-buttons': YoovRadioButtons
  },
  data () {
    return {
      storedSelectedGroup: null,
      yearlys: [
        {title: '02/03', selected: false},
        {title: '03/04', selected: false},
        {title: '04/05', selected: false},
        {title: '05/06', selected: false},
        {title: '06/07', selected: false},
        {title: '08/09', selected: false},
        {title: '09/10', selected: false},
        {title: '10/11', selected: false},
        {title: '11/12', selected: false},
        {title: '12/13', selected: false},
        {title: '13/14', selected: false},
        {title: '14/15', selected: false},
        {title: '15/16', selected: false},
        {title: '16/17', selected: false},
        {title: '18/19', selected: false}
      ]
    }
  },
  computed: {
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
    selectedGroup () {
      let vm = this
      if (vm.groups.length === 0) {
        return null
      } else {
        if (vm.storedSelectedGroup === null) {
          vm.storedSelectedGroup = vm.groups[0]
        }
        return vm.storedSelectedGroup
      }
    }
  },
  watch: {
    groups: {
      handler: function (val) {
        console.log('TaxForms.vue :: watch(groups) groups:', val)
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
    }

  },
  mounted () {
    console.log('TaxForms.vue mounted')
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
  methods: {
    getAvatar (employee) {
      // let vm = this
      if (employee.avatar) {
        return employee.avatarUrl
      } else {
        return constants.oaApiHost + employee.avatarUrl
      }
    },
    onGroupSelectedHandler (group) {
      console.log('TaxForms :: onGroupSelectedHandler :: group: ', group)
      this.storedSelectedGroup = group
    },
    onYearlySelected (yearlyItem) {
      console.log('onYearlySelected :: yearlyItem: ', yearlyItem)
      let i
      for (i = 0; i < this.yearlys.length; i++) {
        this.yearlys[i].selected = this.yearlys[i].title === yearlyItem.title
      }
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
      let yearlyWrapper = vm.$refs.yearlyWrapper
      console.log('yearlyWrapper: ', yearlyWrapper)
      console.log('onYearlysInit :: yearlyWrapper.innerWidth: ', yearlyWrapper.innerWidth)
      console.log('window.innerWidth = ' + window.innerWidth)
      yearlyBox.$el.scrollLeft = window.innerWidth // yearlyWrapper.style.width
    }
  }
}
</script>

<style>
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

  .employee-item:hover {
    background-color: #28ADA7;
    color: white;
  }
  .employee-item:hover .selection-box-column {
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
    width:auto;
    padding: 0.5rem;
    display: inline-block;
    border-radius: 0.5rem;
  }

  .document-icon img {
    width: 48px;
    height: 48px;
  }
</style>
