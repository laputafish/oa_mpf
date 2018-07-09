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
import mockData from './_mockData'
export default {
  data () {
    let vm = this
    return {
      columns: (() => {
        const cols = [
          {title: vm.$t('tax.form_date'), field: 'uid', sortable: true},
          {title: vm.$t('tax.no_of_employee'), field: 'age'},
          {title: vm.$t('tax.employees'), field: 'name', sortable: true},
          {title: vm.$t('tax.operation'), field: ''}
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
        mockData(query).then(({ rows, total }) => {
          this.data = rows
          this.total = total
        })
      },
      deep: true
    }
  }
}
</script>
