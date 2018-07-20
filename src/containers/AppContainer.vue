<template>
  <div class="animated fadeIn">
    <div class="row">
      <div class="col-12">
        <router-view></router-view>
      </div>
    </div>
    <team-selection-dialog
      v-show="showTeamSelection"
      :teams="teams"
      @onTeamSelected="onTeamSelectedHandler"
      @close="closeTeamSelectionDialog"></team-selection-dialog>
    <team-settings-dialog
      v-show="showTeamSettings"
      @close="closeTeamSettingDialog"></team-settings-dialog>
    <tax-form-settings-dialog
      @close="closeTaxFormSettingsDialog"
      v-show="showTaxFormSettings">
    </tax-form-settings-dialog>
  </div>
</template>

<script>
import TeamSelectionDialog from '@/dialogs/TeamSelectionDialog'
import TeamSettingsDialog from '@/dialogs/TeamSettingsDialog'
import TaxFormSettingsDialog from '@/dialogs/TaxFormSettingsDialog'

export default {
  components: {
    'team-selection-dialog': TeamSelectionDialog,
    'team-settings-dialog': TeamSettingsDialog,
    'tax-form-settings-dialog': TaxFormSettingsDialog
  },
  name: 'appContainer',
  computed: {
    showTeamSelection () {
      return this.$store.getters.showTeamSelection
    },
    showTeamSettings () {
      let shown = this.$store.getters.showTeamSettings
      return shown
    },
    showTaxFormSettings () {
      return this.$store.getters.showTaxFormSettings
    },
    teams () {
      return this.$store.getters.teams
    }
  },
  mounted () {
  },
  watch: {
    showTeamSettings: function (val) {
      alert('watch(showTeamSettings)')
    },
    showTaxFormSettings: function (val) {
      alert('watch(showTaxFormSettings)')
    }
    // showTeamSelection: function (val) {
    //   alert('watch(showTeamSelection)')
    // }
  },
  methods: {
    onTeamSelectedHandler (team) {

    },
    closeTeamSettingDialog () {
      this.$store.commit('hideTeamSettings')
    },
    closeTeamSelectionDialog () {
      this.$store.commit('hideTeamSelection')
    }
  }
}
</script>
