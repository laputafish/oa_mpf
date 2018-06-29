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
      let vm = this
      vm.$cookie.set('teamId', team.id)
      vm.$store.dispatch('SET_ACTIVE_TEAM', team).then(function () {
        let promises = [
          vm.$store.dispatch('FETCH_SELF'),
          vm.$store.dispatch('FETCH_EMPLOYEES'),
          vm.$store.dispatch('FETCH_GROUPS')
        ]
        Promise.all(promises).then(function () {
          vm.$router.push({name: 'tax.tax_forms'})
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
      vm.$store.dispatch('login', {
        credentials: vm.credentials,
        callback: (valid, isSupervisor) => {
          // console.log('Login :: callback: status: ', status)
          // console.log('Login :: callback: token: ' + vm.$store.getters.token)
          // console.log('Login :: $cookie.get(teamId): ' + vm.$cookie.get('teamId'))
          if (valid) {
            if (isSupervisor) {
              vm.$router.push({name: 'SuperDashboard'})
            } else {
              let teamId = vm.$cookie.get('teamId')
              if (teamId) {
                vm.$store.dispatch('FETCH_TEAMS').then(function () {
                  let selectedTeam = null
                  let loopTeam = null
                  console.log('after dispatch(FETCH_TEAMS) :: teamId = ' + teamId)
                  console.log('after dispatch(FETCH_TEAMS) :: teams: ', vm.teams)
                  for (loopTeam in vm.teams) {
                    if (loopTeam.id === teamId) {
                      selectedTeam = loopTeam
                      vm.$store.dispatch('SET_ACTIVE_TEAM', loopTeam)
                      break
                    }
                  }
                  if (selectedTeam === null) {
                    vm.showingTeamSelectionDialog = true
                  } else {
                    vm.$router.push({name: 'tax.tax_forms'})
                  }
                })
              } else {
                vm.$router.push({name: 'team.team_selection'})
              }
            }
          } else {
            vm.$dialog.alert('Access Denied!')
          }
        }
      })
      // console.log('after dispatch(login)')
      // let url = constants.apiUrl + '/auth'
      // axios.post(url, vm.credentials).then(function (response) {
      //   let data = response.data
      //   if (data.status === 'ok') {
      //     vm.$store.dispatch('SET_USER', data.user)
      //     vm.$router.push({name: 'Meetings'})
      //   } else {
      //     vm.$dialog.alert('Access Denied!')
      //   }
      // })
    }
  }
}
</script>
