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
import {EventBus} from '@/event-bus'
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
          {title: 'tax.form_type', thComp: 'ThHeader', tdComp: 'FormType', field: 'ird_form_type_name', sortable: true},
          {title: 'tax.ird_code', thComp: 'ThHeader', field: 'ird_code', sortable: true},
          {title: 'tax.ird_form_code', thComp: 'ThHeader', field: 'form_code'},
          {title: 'tax.version', thComp: 'ThHeader', field: 'version', thClass: 'text-center', tdClass: 'text-center', tdComp: 'Version'},
          {title: 'general.is_default', thComp: 'ThHeader', field: 'is_default', thClass: 'text-center', tdComp: 'TdCheckBox', tdClass: 'text-center'},
          {title: 'general.is_letter', thComp: 'ThHeader', field: 'is_letter', thClass: 'text-center', tdComp: 'TdCheckBox', tdClass: 'text-center'},
          {title: 'general.enabled', thComp: 'ThHeader', field: 'enabled', tdComp: 'TdCheckBox', thClass: 'text-center', tdClass: 'text-center'},
          {title: 'general.is_control_list', thComp: 'ThHeader', field: 'is_control_list', tdComp: 'TdCheckBox', thClass: 'text-center', tdClass: 'text-center'},
          {title: 'general.with_cover_letter', thComp: 'ThHeader', field: 'requires_cover_letter', tdComp: 'TdCheckBox', thClass: 'text-center', tdClass: 'text-center'},
          {title: 'general.requires_control_list', thComp: 'ThHeader', field: 'requires_control_list', tdComp: 'TdCheckBox', thClass: 'text-center', tdClass: 'text-center'},
          {title: 'general.can_use_softcopy', thComp: 'ThHeader', field: 'can_use_softcopy', tdComp: 'TdCheckBox', thClass: 'text-center', tdClass: 'text-center'},
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
      vm.$store.dispatch('FETCH_IRD_FORMS', query).then(function (response) {
        vm.data = response.data
        vm.total = response.total
      })
    }
  }
}
</script>

<style>
  #ird-form-manager td {
    padding: 0.2rem;
  }
</style>
