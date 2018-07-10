<template>
  <div style="position:relative;">
    <div class="btn-group" style="position:absolute;top:0;right:60px;">
      <button type="button" class="btn btn-primary">{{ $t('buttons.add') }}</button>
    </div>
    <datatable v-bind="$data"></datatable>
  </div>
</template>

<script>
export default {
  props: {
    employees: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    let vm = this
    return {
      selectedRecord: null,
      mode: 'list',
      columns: (() => {
        const cols = [
          {title: vm.$t('general.no'), field: '$index', sortable: true},
          {title: vm.$t('general.name'), field: 'status', tdComp: 'Status'},
          {
            title: vm.$t('tax.joined_date'),
            field: 'employee_count',
            tdClass: 'text-center',
            thClass: 'text-center'
          },
          {title: vm.$t('tax.operation'), tdComp: 'Opt'}
        ]
        return cols
      })(),
      data: [],
      total: 0,
      query: {}
    }
  }
}
</script>

<style>

</style>
