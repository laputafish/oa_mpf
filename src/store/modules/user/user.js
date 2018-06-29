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
  }
}

const mutations = {
  setActiveTeam: (state, payload) => {
    state.activeTeam = payload
  }
}

const actions = {
  async [types.FETCH_SELF] ({rootState, state, commit, dispatch, getters}) {
    let url = constants.oaApiUrl + '/users/self'
    let headerConfig = rootState.system.oaApiHeaderConfig
    await Vue.axios.get(url, headerConfig).then(response => {
      if (response.data.status) {
        commit('setProfile', response.data.result)
      }
    })
  },

  async [types.SET_ACTIVE_TEAM] ({commit}, payload) {
    await commit('setActiveTeam', payload)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
