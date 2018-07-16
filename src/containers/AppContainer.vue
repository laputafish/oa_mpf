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
  </div>
</template>

<script>
import TeamSelectionDialog from '@/dialogs/TeamSelectionDialog'
import TeamSettingsDialog from '@/dialogs/TeamSettingsDialog'

export default {
  components: {
    'team-selection-dialog': TeamSelectionDialog,
    'team-settings-dialog': TeamSettingsDialog
  },
  name: 'appContainer',
  computed: {
    showTeamSelection () {
      return this.$store.getters.showTeamSelection
    },
    showTeamSettings () {
      let shown = this.$store.getters.showTeamSettings
      alert('shown: ' + shown)
      return shown
    },
    teams () {
      return this.$store.getters.teams
    }
  },
  watch: {
    showTeamSettings: function (val) {
      alert('watch(showTeamSettings)')
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
