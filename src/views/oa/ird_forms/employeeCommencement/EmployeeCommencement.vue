<template>
  <div class="animated fadeIn mx-3">
    <b-card>
      <div slot="header">{{ $t($route.name) }}</div>
      <div style="position:relative;">
        <div class="btn-group" style="position:absolute;top:0;right:60px;">
          <button type="button" class="btn btn-primary">Export</button>
        </div>
        <datatable v-bind="$data"></datatable>
      </div>
    </b-card>
  </div>
</template>
<script>
// import mockData from './_mockData'
import components from './comps'

export default {
  components,
  data () {
    let vm = this
    return {
      columns: (() => {
        const cols = [
          {title: vm.$t('tax.form_date'), field: 'form_date', sortable: true},
          {title: vm.$t('tax.no_of_employee'), field: 'employee_count', tdClass: 'text-center', thClass: 'text-center'},
          {title: vm.$t('tax.employees'), field: 'id', tdComp: 'Employees', sortable: false},
          {title: vm.$t('tax.operation'), tdComp: 'Opt'}
        ]
        return cols
      })(),
      data: [],
      total: 0,
      query: {}
    }
  },
  watch: {
    query: {
      handler (query) {
        let vm = this
        console.log('handler :: EmployeeCommencement :: query: ', query)
        vm.$store.dispatch('FETCH_EMPLOYEE_COMMENCEMENTS', query).then(function (response) {
          console.log('FETCH_EMPLOYEE_COMMENCEMENTS.then :: response:', response)
          vm.data = response.data
          vm.total = response.total
        })
        // mockData(query).then(({ rows, total }) => {
        //   this.data = rows
        //   this.total = total
        // })
      },
      deep: true
    }
  }
}
</script>
