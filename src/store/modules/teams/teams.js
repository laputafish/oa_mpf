import Vue from 'vue'
import * as constants from '../../constants'
import * as types from './teams_types'

const state = {
  teams: [],
  showTeamSelection: false,
  showTeamSettings: false,
  oaTeam: null
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
  },
  oaTeam: (state) => {
    return state.oaTeam
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
  },

  setOATeam: (state, payload) => {
    state.oaTeam = payload
  }
}

const actions = {
  async [types.FETCH_TEAMS] ({rootGetters, state, commit}) {
    console.log('action(FETCH_TEAMS)')
    let url = constants.oaApiUrl + '/t/teams?include=currency'
    let config = {}
    await Vue.axios.get(url, config).then(response => {
      if (response.data.status) {
        console.log('FETCH_TEAMS :: response.data.result : ', response.data.result)
        commit('setTeams', response.data.result)
        console.log('fetch teams :: teams: ', response.data.result)
      }
    })
  },

  async [types.FETCH_TEAM] ({rootGetters, state, commit}) {
    console.log('action(FETCH_TEAM)')
    let url = constants.oaApiUrl + '/t/teams/' + rootGetters.teamId
    await Vue.axios.get(url).then(response => {
      if (response.data.status) {
        console.log('FETCH_TEAMS :: response.data.result : ', response.data.result)
        commit('setOATeam', response.data.result)
        console.log('fetch teams :: teams: ', response.data.result)
      }
    })
  },

  async [types.FETCH_TEAM_INFO] ({rootGetters, state, commit}) {
    console.log('action(FETCH_TEAM_INFO)')
    let url = constants.oaApiUrl + '/t/teams?include=currency'
    await Vue.axios.get(url).then(response => {
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
