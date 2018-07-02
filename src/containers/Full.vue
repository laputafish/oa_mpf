<template>
  <div class="app"
    :class="{'mobile':isMobile}">
    <app-header
      :user="user"/>
    <div class="app-body">
      <sidebar :navItems="nav"/>
      <main class="main">
        <breadcrumb :list="routeList" class="mb-xs-1 mb-sm-3"/>
        <div class="container-fluid">
          <router-view></router-view>
        </div>
      </main>
      <app-aside/>
    </div>
    <app-footer/>
    <team-selection-dialog
      v-show="showTeamSelection"
      :teams="teams"
      @onTeamSelected="onTeamSelectedHandler"
      @close="closeTeamSelectionDialog"></team-selection-dialog>
  </div>
</template>

<script>
import nav from '../_nav'
import {
  AppHeader as appHeader,
  AppSidebar as sidebar,
  AppAside as appAside,
  AppFooter as appFooter} from '../components/index.js'
import Breadcrumb from '../components/Breadcrumb.vue'
import TeamSelectionDialog from '@/dialogs/TeamSelectionDialog'

export default {
  name: 'full',
  components: {
    appHeader,
    sidebar,
    appAside,
    appFooter,
    breadcrumb: Breadcrumb,
    teamSelectionDialog: TeamSelectionDialog
  },
  data () {
    return {
      nav: nav.items
    }
  },
  created () {
    console.log('Full.vue created starts')
    let vm = this
    vm.$store.dispatch('checkToken', {
      callback: function (status) {
        if (!status) {
          vm.$router.push({name: 'Login'})
        }
      }
    })
  },
  mounted () {
    let vm = this
    console.log('Full.vue mounted')
    vm.$store.dispatch('GET_EQUIPMENTS').then(function () {
      console.log('finished: get equipments')
    })
  },
  computed: {
    isMobile () {
      return this.$mq === 'mobile'
    },
    token () {
      return this.$store.getters.token
    },
    name () {
      return 'name not specified' // his.$route.name
    },
    routeList () {
      console.log('Full :: routeList: ', this.$route.matched)
      return this.$route.matched
    },
    user () {
      return this.$store.getters.user
    },
    showTeamSelection () {
      return this.$store.getters.showTeamSelection
    },
    teams () {
      return this.$store.getters.teams
    }
  },
  methods: {
    onTeamSelectedHandler (team) {
      let vm = this
      vm.$cookie.set('teamId', team.id)
      vm.$store.dispatch('SET_ACTIVE_TEAM', team).then(function () {
        this.$store.dispatch('FETCH_SELF')
        this.$store.dispatch('FETCH_EMPLOYEES')
        this.$store.dispatch('FETCH_GROUPS')
      })
    },
    closeTeamSelectionDialog () {
      this.$store.commit('hideTeamSelection')
    }
  }
}
</script>

<style>
  .app.mobile .container-fluid {
    padding: 0 5px;
  }
  .app.mobile .app-footer {
    font-size: 14px;
  }
</style>
