import Vue from 'vue'
import * as constants from '../../constants'
import * as types from './teams_types'

const state = {
  teams: [],
  showTeamSelection: false,
  showTeamSettings: false,
  teamInfo: null
}

const getters = {
  teams: (state) => {
    return state.teams
  },
  showTeamSettings: (state) => {
    return state.showTeamSettings
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
  },

  showTeamSettings: (state) => {
    state.showTeamSettings = true
  },

  hideTeamSettings: (state) => {
    state.showTeamSettings = false
  }
}

const actions = {
  async [types.FETCH_TEAMS] ({rootGetters, state, commit}) {
    let url = constants.oaApiUrl + '/t/teams?include=currency'
    let config = rootGetters.oaApiHeaderConfig
    console.log('fetch teams: config: ', config)
    await Vue.axios.get(url, config).then(response => {
      if (response.data.status) {
        console.log('FETCH_TEAMS :: response.data.result : ', response.data.result)
        commit('setTeams', response.data.result)
        console.log('fetch teams :: teams: ', response.data.result)
      }
    })
  },

  async [types.FETCH_TEAM_INFO] ({rootGetters, state, commit}) {
    let url = constants.oaApiUrl + '/t/teams?include=currency'
    let config = rootGetters.oaApiHeaderConfig
    console.log('fetch teams: config: ', config)
    await Vue.axios.get(url, config).then(response => {
      if (response.data.status) {
        console.log('FETCH_TEAMS :: response.data.result : ', response.data.result)
        commit('setTeams', response.data.result)
        console.log('fetch teams :: teams: ', response.data.result)
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
