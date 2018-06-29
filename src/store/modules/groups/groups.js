import Vue from 'vue'
import * as constants from '../../constants'
import * as types from './groups_types'

const state = {
  groups: []
}

const getters = {
  groups: (state) => {
    return state.groups
  }
}

const mutations = {
  setGroups: (state, payload) => {
    state.groups = payload
  }
}

const actions = {
  async [types.FETCH_GROUPS] ({rootState, state, commit, dispatch, getters}) {
    let url = constants.oaApiUrl + '/groups'
    console.log('actions.FETCH_GROUPS: url=' + url)
    let config = rootState.system.getters.apiHeaderConfig
    console.log('config: rootState: ', rootState)
    console.log('config: rootState.system: ', rootState.system)
    console.log('config: rootState.system.getters: ', rootState.system.getters)
    console.log('config: ', rootState)
    config['params'] = {
      teamId: rootState.user.getters.activeTeam.id
    }
    await Vue.axios.get(url, config).then(response => {
      if (response.data.status) {
        console.log('fetch groups ok')
        console.log('FETCH_TEAMS :: response.data.result : ', response.data.result)
        commit('setTeams', response.data.result)
        console.log('fetch teams :: teams: ', response.data.result)
      } else {
        console.log('fetch groups fails')
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
