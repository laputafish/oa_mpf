<template>
  <div class="animated fadeIn mx-3">
    <b-card>
      <div slot="header">{{ $t($route.name) }}</div>
      <div slot="body">
        <datatable v-bind="data"></datatable>
      </div>
    </b-card>
  </div>
</template>

<script>
import Vue from 'vue'
// import {EventBus} from '@/event-bus'
import components from './comps/'

export default {
  components,
  data () {
    return {
      supportBackup: true,
      supportNested: true,
      // tblClass: 'table-bordered',
      tblStyle: 'color: #666',
      pageSizeOptions: [5, 10, 15, 20],
      columns: [
        {title: this.$t('tax.form_date'), field: 'formDate'}
      ],
      columnsx: (() => {
        const cols = [
          {title: this.$t('tax.form_date'), field: 'formDate', sortable: true, visible: 'true'},
          {title: this.$t('tax.no_of_employee'), field: 'employeeCount', visible: true},
          {title: this.$t('tax.employees'), field: 'employees', visible: true},
          {title: this.$t('tax.operation'), tdComp: 'Opt', visible: true}
        ]
        // const groupsDef = {
        //   Normal: ['Email', 'Username', 'Country', 'IP'],
        //   Sortable: ['UID', 'Age', 'Create time'],
        //   Extra: ['Operation', 'Color', 'Language', 'PL']
        // }
        return cols
      })(),
      data: [],
      total: 0,
      selection: [],
      summary: {},
      // `query` will be initialized to `{ limit: 10, offset: 0, sort: '', order: '' }` by default
      // other query conditions should be either declared explicitly in the following or set with `Vue.set / $vm.$set` manually later
      // otherwise, the new added properties would not be reactive
      query: {},
      // any other staff that you want to pass to dynamic components (thComp / tdComp / nested components)
      xprops: {
        eventbus: new Vue()
      }
    }
  },
  created () {
    console.log('created')
    // const q = { limit: 10, offset: 0, sort: '', order: '', ...this.query }
    // Object.keys(q).forEach(key => { this.$set(this.query, key, q[key]) })
  },
  watch: {
    query: {
      handler (query) {
        console.log('watch(query)')
        this.handleQueryChange(query)
      },
      deep: true
    }
  },
  methods: {
    handleQueryChange (query) {
      console.log('handleQueryChange')
      this.data = [
        {formDate: '2018-01-02', employeeCount: 1, employees: 'John'},
        {formDate: '2018-01-03', employeeCount: 2, employees: 'Peter'},
        {formDate: '2018-01-04', employeeCount: 3, employees: 'Raymond'},
        {formDate: '2018-01-05', employeeCount: 4, employees: 'Donald'},
        {formDate: '2018-01-06', employeeCount: 5, employees: 'Mike'},
        {formDate: '2018-01-07', employeeCount: 6, employees: 'Philip'},
        {formDate: '2018-01-08', employeeCount: 7, employees: 'Mary'}
      ]
      this.total = this.data.length
      console.log('data: ', this.data)
    }
  }
}
</script>

<style>

</style>
