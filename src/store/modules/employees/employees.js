import * as types from './employees_types'
// import * as constants from '../../constants'
// import axios from 'axios'

const state = {
  employees: [],
  groups: []
}

const getters = {}

const mutations = {}

const actions = {
  async [types.FETCH_GROUPS] ({rootState, state, commit, dispatch, getters}) {
    if (rootState.system.oaAuth) {
      // let oaToken = rootState.system.oaAuth.accessToken

    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
