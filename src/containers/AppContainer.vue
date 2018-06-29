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
  </div>
</template>

<script>
import TeamSelectionDialog from '@/dialogs/TeamSelectionDialog'

export default {
  components: {
    'team-selection-dialog': TeamSelectionDialog
  },
  name: 'appContainer',
  computed: {
    showTeamSelection () {
      return this.$store.getters.showTeamSelection
    },
    teams () {
      return this.$store.getters.teams
    }
  },
  watch: {
    // showTeamSelection: function (val) {
    //   alert('watch(showTeamSelection)')
    // }
  },
  methods: {
    onTeamSelectedHandler (team) {

    },
    closeTeamSelectionDialog () {
      this.$store.commit('hideTeamSelection')
    }
  }
}
</script>
