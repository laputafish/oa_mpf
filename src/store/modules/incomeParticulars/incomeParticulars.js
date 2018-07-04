import Vue from 'vue'
import * as constants from '../../constants'
import * as types from './incomeParticulars_types'

const state = {
  incomeParticulars: []
}

const getters = {
  incomeParticulars: (state) => {
    return state.incomeParticulars
  }
}

const mutations = {
  setIncomeParticulars: (state, payload) => {
    state.incomeParticulars = payload
  }
}

const actions = {
  [types.FETCH_INCOME_PARTICULARS] ({rootGetters, commit}, payload) {
    return new Promise((resolve, reject) => {
      let teamId = rootGetters.user ? rootGetters.user.oa_last_team_id : ''
      let url = constants.apiUrl + '/income_particulars'
      let config = {
        ...rootGetters.apiHeaderConfig,
        params: {
          teamId: teamId
        }
      }
      Vue.axios.get(url, config).then(function (response) {
        console.log('incomeParticular actions FETCH_INCOME_PARTICULARS: resPonse: ', response)
        if (response.data.status) {
          commit('setIncomeParticulars', response.data.result)
          resolve(response.data.result)
        }
      })
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
