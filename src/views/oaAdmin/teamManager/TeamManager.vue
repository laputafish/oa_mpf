<template>
  <div class="animated fadeIn mx-2" id="team-manager">
    <b-card>
      <div slot="header">
        {{ $t('team.team_manager') }}
      </div>
      <datatable v-cloak v-bind="$data"></datatable>
    </b-card>
  </div>
</template>

<script>
// import * as constants from '@/store/constants'
import components from './dtComps'
import {EventBus} from '@/event-bus'
import yoovRadioToggle from '@/components/forms/YoovRadioToggle'
// import helpers from '@/helpers.js'
import ThHeader from '@/components/datatable/ThHeader'
// import TdCheckBox from '@/components/datatable/TdCheckBox'

export default {
  components: {
    ...components,
    yoovRadioToggle,
    'ThHeader': ThHeader
  },
  data () {
    return {
      columns: (() => {
        const cols = [
          {title: 'team.logo', thComp: 'ThHeader', tdComp: 'Logo', field: 'oa_team_logo_path', thClass: 'text-center', tdClass: 'text-center'},
          {title: 'team.team_name', thComp: 'ThHeader', field: 'oa_team_name', sortable: true},
          {title: 'team.team_id', thComp: 'ThHeader', field: 'oa_team_id', sortable: true},
          {title: 'team.team_code', thComp: 'ThHeader', field: 'oa_team_code', sortable: true},
          {title: 'general.created_at', thComp: 'ThHeader', field: 'oa_team_created_at', sortable: true},
          {title: 'general.currency', thComp: 'ThHeader', field: 'oa_team_currency_code', thClass: 'text-center', tdClass: 'text-center', sortable: true},
          {title: 'general.operation', thComp: 'ThHeader', tdComp: 'Opt'}
        ]
        return cols
      })(),
      data: [],
      total: 0,
      query: {
        filter: '',
        sort: '',
        order: ''
      }
    }
  },
  created () {
    let vm = this
    vm.$set(this.query, 'filter', '')
    EventBus.$on('editRecord', vm.editRecord)
  },
  beforeDestroy () {
    EventBus.$off('editRecord')
  },
  watch: {
    query: {
      handler (query) {
        this.onQueryChangedHandler(query)
      },
      deep: true
    }
  },
  methods: {
    editRecord (record) {
      console.log('IrdFormManager :; editRecord :: record: ', record)
    },
    onQueryChangedHandler (query) {
      let vm = this
      vm.$store.dispatch('FETCH_APP_TEAMS', query).then(function (response) {
        vm.data = response.data
        vm.total = response.total
      })
    }
  }
}
</script>

<style>
  #team-manager td {
    padding: 0.2rem;
  }
</style>
