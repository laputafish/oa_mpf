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
  async [types.UPDATE_TEAMS] ({commit}, payload) {
    let url = constants.apiUrl + '/teams'
    let data = {
      teams: payload
    }
    Vue.axios.post(url, data)
  },

  [types.FETCH_APP_TEAMS] ({commit}, payload) {
    return new Promise((resolve, reject) => {
      let query = payload
      let page = Math.floor(query.offset / query.limit)
      let url = constants.apiUrl + '/teams'
      let config = {
        params: {
          ...query,
          page: page
        }
      }
      Vue.axios.get(url, config).then(function (response) {
        if (response.data.status) {
          resolve(response.data.result)
        } else {
          reject(new Error('error'))
        }
      }, function (error) {
        reject(error)
      })
    })
  },

  async [types.FETCH_TEAMS] ({rootGetters, state, commit, dispatch}) {
    console.log('action(FETCH_TEAMS)')
    let url = constants.oaApiUrl + '/t/teams?include=currency'
    let config = {}
    await Vue.axios.get(url, config).then(response => {
      if (response.data.status) {
        dispatch('UPDATE_TEAMS', response.data.result)
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
