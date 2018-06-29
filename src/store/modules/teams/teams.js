import Vue from 'vue'
// import {app} from '@/main'
import * as constants from '../../constants'
import * as types from './teams_types'

const state = {
  teams: [],
  showTeamSelection: false
}

const getters = {
  teams: (state) => {
    return state.teams
  },
  showTeamSelection: (state) => {
    return state.showTeamSelection
  }
}

const mutations = {
  setTeams: (state, payload) => {
    console.log('teams.js :: setTeams :: state: ', state)
    state.teams = payload
  },

  showTeamSelection: (state) => {
    state.showTeamSelection = true
  },

  hideTeamSelection: (state) => {
    state.showTeamSelection = false
  }
}

const actions = {
  async [types.FETCH_TEAMS] ({rootState, state, commit, dispatch, getters}) {
    let url = constants.oaApiUrl + '/teams?include=currency'

    // Vue.axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
    // Vue.axios.defaults.headers.common['Content-Type'] = 'application/json'
    // Vue.axios.defaults.headers.common['Accept'] = 'application/json'
    let config = {
      headers: {
        'Authorization': rootState.system.oaAuth.tokenType + ' ' + rootState.system.oaAuth.accessToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*'
      }
    }
    await Vue.axios.get(url, config).then(response => {
      if (response.data.status) {
        console.log('FETCH_TEAMS :: response.data.result : ', response.data.result)
        commit('setTeams', response.data.result)
        console.log('fetch teams :: teams: ', response.data.result)
      }
    })
  }

  // ,
  //
  // async [types.SET_TEAMS] ({commit}, payload) {
  //   await commit('setTeams', payload)
  // }
}

export default {
  state,
  getters,
  mutations,
  actions
}
