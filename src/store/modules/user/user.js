import Vue from 'vue'
import * as constants from '../../constants'
import * as types from './user_types'

const state = {
  profile: null,
  activeTeam: null,
  roles: []
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
  },
  roles: (state) => {
    return state.roles
  }
}

const mutations = {
  setActiveTeam: (state, payload) => {
    state.activeTeam = payload
  },
  setProfile: (state, payload) => {
    state.profile = payload
  },
  setRoles: (state, payload) => {
    state.roles = payload
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
    let vm = this
    let url = constants.oaApiUrl + '/t/users/self'
    let config = {}
    if (payload && payload['oaAuth']) {
      config['headers'] = vm.oaAuth2Headers(payload['oaAuth'])
    }
    return new Promise((resolve, reject) => {
      Vue.axios.get(url, config).then(response => {
        if (response.data.status) {
          dispatch('UPDATE_EMPLOYEE_ID', response.data.result.id)
          commit('setEmployeeId', response.data.result.id)
          commit('setProfile', response.data.result)
          resolve(response.data.result)
        } else {
          reject(response.data)
        }
      }).catch((error) => {
        reject(error)
      })
    })
  },

  [types.UPDATE_EMPLOYEE_ID] ({rootGetters}, payload) {
    let user = rootGetters.user
    let url = constants.apiUrl + '/users/' + user.id
    let config = {
      employee_id: payload
    }
    Vue.axios.put(url, config).then(response => {
      if (response.data.status) {
      }
    })
  },

  [types.FETCH_OA_PERMISSIONS] ({rootDispatch, rootGetters, state, commit, dispatch}, payload) {
    let vm = this
    let oaTeamId = rootGetters.user.oa_last_team_id
    let url = constants.oaApiUrl + '/user/employees/' + rootGetters.user.employee_id
    let config = {
      params: {
        teamId: oaTeamId,
        include: 'locations,groups,permissions'
      }
    }
    if (payload && payload['oaAuth']) {
      config['headers'] = vm.oaAuth2Headers(payload['oaAuth'])
    }
    return new Promise((resolve, reject) => {
      Vue.axios.get(url, config).then(response => {
        if (response.data.status) {
          let roles = response.data.result.roles
          console.log('FETCH_OA_PERMISSIONS => commit(setRoles, roles) roles: ', roles)
          commit('setRoles', roles)
          console.log('FETCH_OA_PERMISSIONS => resolve(roles)')
          resolve(roles)
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
