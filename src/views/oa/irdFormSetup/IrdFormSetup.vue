<template>
  <div class="animated fadeIn mx-3" id="ird-form-setup">
    <b-card>
      <div slot="header">
        {{ $t('tax.setup') }}
      </div>
      <ird-form-setup-table
        @close="returnLastMode"
        ref="setupForm"></ird-form-setup-table>
    </b-card>
  </div>
</template>

<script>
import IrdFormSetupTable from './comps/IrdFormSetupTable'

export default {
  components: {
    irdFormSetupTable: IrdFormSetupTable
  },
  methods: {
  }
}
</script>
