import Vue from 'vue'
import * as constants from '../../constants'
import * as types from './employees_types'

const state = {
  employees: [],
  groups: []
}

const getters = {
  employees: state => {
    return state.employees
  }
}

const mutations = {
  setEmployees: (state, payload) => {
    state.employees = payload
  }
}

const actions = {
  async [types.FETCH_EMPLOYEES] ({rootGetters, state, commit, dispatch, getters}) {
    let url = constants.oaApiUrl + '/user/employees'
    let config = rootGetters.oaApiHeaderConfig
    config['params'] = {
      state: 'active',
      include: 'groups,workingGroups,permissions',
      teamId: rootGetters.activeTeamId
    }
    await Vue.axios.get(url, config).then(response => {
      if (response.data.status) {
        commit('setEmployees', response.data.result)
        console.log('FETCH_EMPLOYEES: employees: ', response.data.result)
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
