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
    <tax-form-settings-dialog
      @close="closeTaxFormSettingsDialog"
      v-show="showTaxFormSettings">
    </tax-form-settings-dialog>
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
import TaxFormSettingsDialog from '@/dialogs/TaxFormSettingsDialog'

export default {
  name: 'full',
  components: {
    appHeader,
    sidebar,
    appAside,
    appFooter,
    breadcrumb: Breadcrumb,
    teamSelectionDialog: TeamSelectionDialog,
    'tax-form-settings-dialog': TaxFormSettingsDialog
  },
  data () {
    return {
      nav: nav.items
    }
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
      console.log('Full :: computed(routeList) (required by breadcrumb): ', this.$route.matched)
      console.log('Full.vue :: $route.matched: ', this.$route.matched)
      return this.$route.matched
    },
    user () {
      console.log('Full.vue :: computed(user)')
      return this.$store.getters.user
    },
    showTeamSelection () {
      console.log('Full.vue :: computed(showTeamSelection)')
      return this.$store.getters.showTeamSelection
    },
    showTaxFormSettings () {
      return this.$store.getters.showTaxFormSettings
    },
    teams () {
      console.log('Full.vue :: computed(teams)')
      return this.$store.getters.teams
    },
    isPayrollAdmin () {
      return this.$store.getters.isPayrollAdmin
    }
  },
  created () {
    // let vm = this
    console.log('Full.vue :: created')
    // vm.$store.dispatch('checkToken', {
    //   callback: function (status) {
    //     if (!status) {
    //       vm.$router.push({name: 'Login'})
    //     }
    //   }
    // })
  },
  mounted () {
    // alert('Full.vue mounted')
    let vm = this
    console.log('Full.vue :: mounted')
    // if (!vm.user) {
    //   console.log('Full.vue :: mounted : !vm.user => login')
    //   vm.$router.push({name: 'Login'})
    //   return
    // }
    console.log('Full.vue mounted user: ', vm.user)
    vm.$store.dispatch('GET_EQUIPMENTS').then(function () {
      console.log('finished: get equipments')
    })
    if (vm.user) {
      vm.loadGroupsAndEmployees()
    }
  },
  watch: {
    user: function (val) {
      let vm = this
      if (!val.oa_last_team_id) {
        console.log('Full.vue watch(user) :: router.push(/login)  val: ', val)
        vm.$router.push('/login')
      } else {
        vm.loadGroupsAndEmployees()
      }
    }
  },
  methods: {
    loadGroupsAndEmployees () {
      let vm = this
      vm.$store.dispatch('refreshOAToken').then(function (oaAuth) {
        let payload = {oaAuth: oaAuth}
        vm.$store.dispatch('FETCH_SELF', payload).then(function () {
          vm.$store.dispatch('FETCH_EMPLOYEES', payload).then(function () {
            vm.$store.dispatch('FETCH_OA_GROUPS', payload)
            vm.$store.dispatch('FETCH_OA_PERMISSIONS', payload)
          })
        })
      })
    },
    onTeamSelectedHandler (team) {
      let vm = this
      console.log('Full.vue :: onTeamSelectedHandler')
      vm.$store.dispatch('SET_DB_TEAM', team).then(function () {
        vm.loadGroupsAndEmployees()
      })
    },
    closeTaxFormSettingsDialog () {
      this.$store.commit('hideTaxFormSettings')
    },
    closeTeamSelectionDialog () {
      this.$store.commit('hideTeamSelection')
    }
    // ,
    // getCookieToken () {
    //   const cookieStr = process.browser ? document.cookie : this.app.context.req.headers.cookie
    //   const cookies = Cookie.parse(cookieStr || '') || {}
    //   return cookies['ccmsToken']
    // }
  }
}
</script>

<style>
  .app {
    z-index: 0;
    background-color:rgb(242, 244, 248);
  }
  .app.mobile .container-fluid {
    padding: 0 5px;
  }
  .app.mobile .app-footer {
    font-size: 14px;
  }
</style>
