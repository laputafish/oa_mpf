import Vue from 'vue'
import * as constants from '../../constants'
import * as types from './payTypes_types'

const state = {
  payTypes: []
}

const getters = {
  payTypes: (state) => {
    return state.payTypes
  }
}

const mutations = {
  setPayTypes: (state, payload) => {
    state.payTypes = payload
  }
}

const actions = {
  async [types.FETCH_PAY_TYPES] ({rootGetters, commit}) {
    return new Promise((resolve, reject) => {
      let url = constants.oaApiUrl + '/admin/pay_types'
      let teamId = rootGetters.teamId
      console.log('FETCH_PAY_TYPES :; teamId = ' + teamId)
      if (teamId && teamId !== '') {
        let config = {
          ...rootGetters.oaApiHeaderConfig,
          params: {
            teamId: teamId
          }
        }
        Vue.axios.get(url, config).then(function (response) {
          if (response.data.status) {
            commit('setPayTypes', response.data.result)
            resolve(response.data.result)
          }
        })
      } else {
        resolve([])
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
