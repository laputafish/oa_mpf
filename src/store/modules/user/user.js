import Vue from 'vue'
import * as constants from '../../constants'
import * as types from './user_types'

const state = {
  profile: null,
  activeTeam: null
}

const getters = {
  profile: (state) => {
    return state.profile
  },
  activeTeam: (state) => {
    return state.activeTeam
  },
  activeTeamId: (state) => {
    console.log('user.js :: getters.activeItemId')
    return state.activeTeam ? state.activeTeam.id : 0
  }
}

const mutations = {
  setActiveTeam: (state, payload) => {
    state.activeTeam = payload
  },
  setProfile: (state, payload) => {
    state.profile = payload
  }
}

const actions = {
  // async [types.UPDATE_DB_USER] ({commit}, payload) {
  //   let url = constants.oaApiUrl + '/t/users/self'
  //   let headerConfig = rootGetters.oaApiHeaderConfig
  //   await Vue.axios.get(url, headerConfig).then(response => {
  //     if (response.data.status) {
  //       dispatch('UPDATE_DB_USER', response.data.result)
  //       commit('setProfile', response.data.result)
  //     }
  //   })
  // }

  [types.FETCH_SELF] ({rootDispatch, rootGetters, state, commit, dispatch}, payload) {
    console.log('action(FETCH_SELF)')
    let vm = this
    let url = constants.oaApiUrl + '/t/users/self'
    let config = {}
    if (payload && payload['oaAuth']) {
      config['headers'] = vm.oaAuth2Headers(payload['oaAuth'])
    }

    // let teamId = rootGetters.teamId
    // let url = constants.oaApiUrl + '/user/employees/self'
    // let config = {
    //   params: {
    //     include: 'groups',
    //     teamId: teamId
    //   }
    // }
    return new Promise((resolve, reject) => {
      Vue.axios.get(url, config).then(response => {
        if (response.data.status) {
          // let employeeId = response.data.result.groups[0].groupEmployee.employeeId
          // dispatch('UPDATE_EMPLOYEE_ID', employeeId)
          // commit('setEmployeeId', employeeId)
          commit('setProfile', response.data.result)
          resolve(response.data.result)
        } else {
          reject(response.data)
        }
      }).catch((error) => {
        reject(error)
      })
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
