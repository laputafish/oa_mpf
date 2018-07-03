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
  async [types.FETCH_SELF] ({rootGetters, state, commit}) {
    let url = constants.oaApiUrl + '/t/users/self'
    let headerConfig = rootGetters.oaApiHeaderConfig
    await Vue.axios.get(url, headerConfig).then(response => {
      if (response.data.status) {
        commit('setProfile', response.data.result)
      }
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}