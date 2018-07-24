// import Vue from 'vue'
// import * as constants from '../../constants'
// import * as types from './incomeParticulars_types'

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
  },
  setIncomeParticularPayTypes: (state, payload) => {
    for (var i = 0; i < state.incomeParticulars.length; i++) {
      if (state.incomeParticulars[i].id === payload.id) {
        state.incomeParticulars[i].pay_type_ids = payload.payTypes.map(payType => payType.id)
      }
    }
  }
}

const actions = {
  // [types.FETCH_INCOME_PARTICULARS] ({rootGetters, commit}, payload) {
  //   return new Promise((resolve, reject) => {
  //     let teamId = rootGetters.user ? rootGetters.user.oa_last_team_id : ''
  //     let url = constants.apiUrl + '/income_particulars'
  //     let config = {
  //       ...rootGetters.apiHeaderConfig,
  //       params: {
  //         teamId: teamId
  //       }
  //     }
  //     Vue.axios.get(url, config).then(function (response) {
  //       console.log('incomeParticular actions FETCH_INCOME_PARTICULARS: resPonse: ', response)
  //       if (response.data.status) {
  //         commit('setIncomeParticulars', response.data.result)
  //         resolve(response.data.result)
  //       }
  //     })
  //   })
  // },

  // [types.UPDATE_INCOME_PARTICULAR_PAYTYPES] ({rootGetters, commit}, payload) {
  //   commit('setIncomeParticularPayTypes', payload)
  // }
}

export default {
  state,
  getters,
  mutations,
  actions
}
