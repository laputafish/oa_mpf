import Vue from 'vue'
import * as constants from '../../constants'
import * as types from './payrolls_types'

const state = {
  payrolls: []
}

const getters = {
  payrolls: (state) => {
    return state.payrolls
  }
}

const mutations = {
  setPayrolls: (state, payrolls) => {
    state.payrolls = payrolls
  }
}

const actions = {
  async [types.FETCH_PAYROLLS] ({rootGetters, commit}) {
    let teamId = rootGetters.teamId
    if (teamId) {
      let url = constants.oaApiUrl + '/admin/payrolls'
      let config = {
        ...rootGetters.oaApiHeaderConfig,
        params: {
          teamId: teamId
        }
      }
      await Vue.axios.get(url, config).then(function (response) {
        if (response.data.status) {
          commit('setPayrolls', response.data.result)
        }
      })
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
