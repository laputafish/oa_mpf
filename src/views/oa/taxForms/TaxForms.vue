<template>
  <div class="tax-forms animated fadeIn mx-3">
    <div class="row">
      <div class="col-sm-12">
        <button type="button" class="pull-right btn-width-80 btn btn-default">
          <i class="fa fa-gear"></i>
        </button>
        <h2>{{ $t('tax.tax_forms') }}</h2>
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

          </div>
        </div>
      </div>

    </div>
    <div class="d-flex flex-column">
    </div>
  </div>
</template>

<script>
import GroupHierarchicalItem from '@/views/components/GroupHierarchicalItem'
import YoovRadioButtons from '@/components/YoovRadioButtons'

export default {
  components: {
    'group-hierarchical-item': GroupHierarchicalItem,
    'yoov-radio-buttons': YoovRadioButtons
  },
  data () {
    return {
      selectedGroup: null,
      groups: [],
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
  mounted () {
    let vm = this
    vm.groups = [
      {
        name: vm.$t('general.all_staff'),
        children: [
          {name: 'Administration Team'},
          {name: 'Marketing Team'},
          {name: 'Accounting Team'},
          {name: 'Sales Team'},
          {
            name: 'Technical Team',
            children: [
              {name: 'Mobile Apps Development Team'},
              {name: 'Web Development Team'},
              {name: 'Desktop Development Team'}
            ]
          },
          {name: 'Management Team'}
        ]
      }
    ]
    vm.selectedGroup = vm.groups[0]
  },
  methods: {
    onGroupSelectedHandler (group) {
      console.log('TaxForms :: onGroupSelectedHandler :: group: ', group)
      this.selectedGroup = group
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
</style>
