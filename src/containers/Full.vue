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
      v-if="showTeamSelection"
      :teams="teams"
      @onTeamSelected="onTeamSelectedHandler"
      @close="closeTeamSelectionDialog"></team-selection-dialog>
    <tax-form-settings-dialog
      @close="closeTaxFormSettingsDialog"
      v-if="showTaxFormSettings">
    </tax-form-settings-dialog>
  </div>
</template>

<script>
import userNav from '../_user_nav'
import supervisorNav from '../_supervisor_nav'

import {
  AppHeader as appHeader,
  AppSidebar as sidebar,
  AppAsideSettings as appAside,
  // AppAsideSettings as appAsideSettings,
  // AppAside2 as appAside2,
  AppFooter as appFooter} from '../components/index.js'
import Breadcrumb from '../components/Breadcrumb.vue'
import TeamSelectionDialog from '@/dialogs/TeamSelectionDialog'
import TaxFormSettingsDialog from '@/dialogs/TaxFormSettingsDialog'

export default {
  name: 'full',
  components: {
    appHeader,
    sidebar,
    appAside: appAside,
    appFooter,
    breadcrumb: Breadcrumb,
    teamSelectionDialog: TeamSelectionDialog,
    'tax-form-settings-dialog': TaxFormSettingsDialog
  },
  data () {
    return {
      // nav: nav.items
    }
  },
  computed: {
    isPayrollAdmin () {
      return this.$store.getters.isPayrollAdmin
    },
    isUser () {
      return !this.$store.getters.isSupervisor
    },
    isOwner () {
      return this.$store.getters.isOwner
    },
    roles () {
      let vm = this
      return vm.$store.getters.roles.map(item => item.name)
    },
    nav () {
      let vm = this
      let result = []
      let nav = userNav
      if (vm.$store.getters.isSupervisor) {
        nav = supervisorNav
      }
      for (var i = 0; i < nav.items.length; i++) {
        var item = nav.items[i]
        if (Object.keys(item).indexOf('authRole') >= 0) {
          let authRole = item['authRole']
          switch (authRole) {
            case 'Payroll Management':
              if (vm.isPayrollAdmin || vm.isOwner) {
                result.push(item)
              }
          // }
          // if (vm.roles.indexOf(authRole) >= 0) {
          //   result.push(item)
          }
        } else {
          result.push(item)
        }
      }
      return result
    },
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
      return this.$store.getters.showTeamSelection && this.isUser
    },
    showTaxFormSettings () {
      return this.$store.getters.showTaxFormSettings && this.isUser
    },
    teams () {
      console.log('Full.vue :: computed(teams)')
      return this.$store.getters.teams
    }
    // ,
    // isPayrollAdmin () {
    //   return this.$store.getters.isPayrollAdmin
    // }
  },
  mounted () {
    let vm = this
    vm.$store.dispatch('FETCH_LANGUAGES')
    vm.$store.dispatch('GET_EQUIPMENTS').then(function () {
      console.log('finished: get equipments')
    })
    if (vm.isUser) {
      if (vm.user) {
        vm.loadGroupsAndEmployees()
      }
    }
  },
  watch: {
    user: function (val) {
      let vm = this
      if (vm.isUser) {
        if (!val.oa_last_team_id) {
          console.log('Full.vue watch(user) :: router.push(/login)  val: ', val)
          vm.$router.push('/login')
        } else {
          vm.loadGroupsAndEmployees()
        }
      }
    }
  },
  methods: {
    loadGroupsAndEmployees () {
      let vm = this
      if (vm.isUser) {
        vm.$store.dispatch('refreshOAToken').then(function (oaAuth) {
          let payload = {oaAuth: oaAuth}
          vm.$store.dispatch('FETCH_SELF', payload).then(function () {
            vm.$store.dispatch('FETCH_EMPLOYEES', payload).then(function () {
              vm.$store.dispatch('FETCH_OA_GROUPS', payload)
              vm.$store.dispatch('FETCH_OA_PERMISSIONS', payload)
            })
          })
        })
      }
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
