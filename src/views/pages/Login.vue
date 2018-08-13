<template>
  <div class="app flex-row align-items-center animated fadeIn">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card-group mb-0">
            <div class="card p-4">
              <div class="card-body">
                <h1 @click="onTitleClicked">{{ $t('login.login') }}</h1>
                <p class="text-muted">{{ $t('login.sign_in_to_your_account') }}</p>
                <div class="input-group mb-3">
                  <span class="input-group-addon"><i class="icon-user"></i></span>
                  <input type="text" class="form-control" placeholder="Email"
                         v-model="credentials.email">
                </div>
                <div class="input-group mb-4">
                  <span class="input-group-addon"><i class="icon-lock"></i></span>
                  <input type="password" class="form-control" placeholder="Password"
                         v-model="credentials.password">
                </div>
                <div class="row">
                  <div class="col-6">
                    <button type="button"
                            @click="login"
                            class="btn btn-primary px-4">{{ $t('login.login') }}
                    </button>
                  </div>
                  <div class="col-6 text-right">
                    <button type="button" class="btn btn-link px-0">{{ $t('login.forgot_password') }}?</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="card text-white bg-primary py-5 d-md-down-none" style="width:44%">
              <div class="card-body text-center">
                <div>
                  <h2>Sign up</h2>
                  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                    labore et dolore magna aliqua.</p>
                  <button type="button" class="btn btn-primary active mt-3">Register Now!</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <generic-dialog></generic-dialog>
    <team-selection-dialog
      v-show="showingTeamSelectionDialog"
      @close="showingTeamSelectionDialog=false"
      @onTeamSelected="onTeamSelectedHandler"></team-selection-dialog>
  </div>
</template>

<script>
// import * as constants from '@/store/constants.json'
// import axios from 'axios'
import GenericDialog from '@/dialogs/GenericDialog'
import TeamSelectionDialog from '@/dialogs/TeamSelectionDialog'

export default {
  name: 'Login',
  components: {
    'generic-dialog': GenericDialog,
    'team-selection-dialog': TeamSelectionDialog
  },
  data () {
    return {
      titleClicked: 0,
      showingTeamSelectionDialog: false,
      credentials: {
        email: 'domaccount@gmail.com',
        password: 'yoovYoov1_'
      }
    }
  },
  computed: {
    token () {
      if (this.$store.getters) {
        return this.$store.getters.token
      } else {
        return ''
      }
    },
    user () {
      return this.$store.getters.user
    },
    teams () {
      return this.$store.getters.teams
    },
    groups () {
      return this.$store.getters.groups
    }
  },
  mounted () {
    // this.$store.dispatch('CLEAR_COOKIE_TOKEN')
    // this.$store.dispatch('FETCH_TEAMS')
  },
  methods: {
    onTitleClicked () {
      let vm = this
      vm.titleClicked++
      if (this.titleClicked >= 3) {
        vm.credentials.email = 'testing@hkce.com'
        vm.credentials.password = '123456'
        vm.titleClicked = 0
      }
    },
    onTeamSelectedHandler (team) {
      alert('onTeamSelectedHandler')
      let vm = this
      vm.$store.dispatch('SET_DB_TEAM', team).then(function () {
        let promises = [
          vm.$store.dispatch('FETCH_EMPLOYEES'),
          vm.$store.dispatch('FETCH_OA_GROUPS'),
          vm.$store.dispatch('FETCH_OA_USER_EMPLOYEE').then(function (employee) {
            // let employeeId = employee.groups[0]['groupEmployee']['employeeId']
            // console.log('FETCH_OA_USER_EMPLOYEE.then: employee: ', employee)
            // vm.$store.dispatch('FETCH_OA_PERMISSIONS', {employeeId: employeeId})
          })
        ]
        Promise.all(promises).then(function () {
          console.log('onTeamSelectedHandler :: all(promises).then => tax_form_management')
          vm.$router.push({name: 'tax.tax_form_management'})
          // vm.$router.push({name: 'tax.tax_forms'})
        })
      })
    },
    setToken (value) {
      console.log('setToken :: value:', value)
      this.$store.dispatch('SET_TOKEN', value)
    },
    login () {
      let vm = this
      // console.log('Login => vm.$store.dispatch(login)')
      vm.$store.dispatch('AUTH_REQUEST', {credentials: vm.credentials})
        .then(function (response) {
          let valid = response.valid
          let isSupervisor = response.isSupervisor
          console.log('Login.vue :: Login :: AUTH_REQUEST :: response:', response)
          // console.log('Login :: callback: status: ', status)
          // console.log('Login :: callback: token: ' + vm.$store.getters.token)
          // console.log('Login :: $cookie.get(teamId): ' + vm.$cookie.get('teamId'))
          if (valid) {
            if (isSupervisor) {
              vm.$router.push({name: 'SuperDashboard'})
            } else {
              if (vm.user.employee_id === 0) {
                vm.$store.dispatch('FETCH_SELF').then(function (response) {
                  vm.checkActiveTeam()
                })
              } else {
                vm.checkActiveTeam()
              }
            }
          } else {
            vm.$dialog.alert(vm.$t('messages.access_denied'))
          }
        })
    },
    checkActiveTeam () {
      let vm = this
      console.log('login :: if not isSupervisor   user: ', vm.$store.getters.user)
      let teamId = vm.$store.getters.user.oa_last_team_id
      if (teamId) {
        vm.$store.dispatch('FETCH_TEAMS').then(function () {
          let selectedTeam = null
          console.log('after dispatch(FETCH_TEAMS) :: teamId = ' + teamId)
          console.log('after dispatch(FETCH_TEAMS) :: teams: ', vm.teams)
          console.log('belong team check : team id = ' + teamId)
          var loopTeam = null
          for (var i = 0; i < vm.teams.length; i++) {
            loopTeam = vm.teams[i]
            console.log('loop team id = ' + loopTeam.id)
            if (loopTeam.id === teamId) {
              selectedTeam = loopTeam
              vm.$store.dispatch('SET_ACTIVE_TEAM', loopTeam)
              break
            }
          }
          if (selectedTeam === null) {
            vm.showingTeamSelectionDialog = true
          } else {
            console.log('Login.vue => push(tax.tax_form_management)')
            vm.$router.push({name: 'tax.tax_form_management'})
          }
        })
      } else {
        vm.$store.dispatch('FETCH_TEAMS').then(function () {
          vm.showingTeamSelectionDialog = true
        })
      }
    }
  }
}
</script>
