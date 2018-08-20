<template>
  <div class="animated fadeIn mx-2" id="ird-form-manager">
    <b-card>
      <div slot="header">
        {{ $t('tax.tax_form_manager') }}
      </div>
      <datatable v-cloak v-bind="$data"></datatable>
    </b-card>
  </div>
</template>

<script>
// import * as constants from '@/store/constants'
import components from './dtComps'
// import {EventBus} from '@/event-bus'
import irdFormRecord from './comps/IrdFormRecord'
import yoovRadioToggle from '@/components/forms/YoovRadioToggle'
// import helpers from '@/helpers.js'
import ThHeader from '@/components/datatable/ThHeader'
import TdCheckBox from '@/components/datatable/TdCheckBox'

export default {
  components: {
    ...components,
    irdFormRecord,
    yoovRadioToggle,
    'ThHeader': ThHeader,
    'TdCheckBox': TdCheckBox
  },
  data () {
    return {
      columns: (() => {
        const cols = [
          {title: 'tax.form_type', thComp: 'ThHeader', tdComp: 'FormType', field: 'ird_form_type_id', sortable: true},
          {title: 'tax.ird_code', thComp: 'ThHeader', field: 'ird_code', sortable: true},
          {title: 'tax.ird_form_code', thComp: 'ThHeader', field: 'form_code'},
          {title: 'tax.version', thComp: 'ThHeader', field: 'version', thClass: 'text-center', tdClass: 'text-center', tdComp: 'Version'},
          {title: 'tax.is_default', thComp: 'ThHeader', field: 'published', thClass: 'text-center', tdComp: 'TdCheckBox', tdClass: 'text-center'},
          {title: 'general.enabled', thComp: 'ThHeader', field: 'status', tdComp: 'TdCheckBox', thClass: 'text-center', tdClass: 'text-center'},
          {title: 'general.is_control_list', thComp: 'ThHeader', field: 'submitted_on', tdComp: 'TdCheckBox', thClass: 'text-center', tdClass: 'text-center'},
          {title: 'general.is_cover_list', thComp: 'ThHeader', field: 'submitted_on', tdComp: 'TdCheckBox', thClass: 'text-center', tdClass: 'text-center'},
          {title: 'general.can_use_softcopy', thComp: 'ThHeader', field: 'submitted_on', tdComp: 'TdCheckBox', thClass: 'text-center', tdClass: 'text-center'},
          {title: 'tax.operation', thComp: 'ThHeader', tdComp: 'Opt'}
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
  methods: {
  },
  created () {
    this.$set(this.query, 'filter', '')
  },
  watch: {
    query: {
      handler (query) {
        this.onQueryChangedHandler(query)
      },
      deep: true
    }
  },
  onQueryChangedHandler (query) {
    let vm = this
    vm.$store.dispatch('FETCH_IRD_FORMS', query).then(function (response) {
      vm.data = response.data
      vm.total = response.total
    })
  }
}
</script>
