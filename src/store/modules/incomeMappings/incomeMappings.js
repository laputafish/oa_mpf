// import Vue from 'vue'
// import * as constants from '../../constants'
// import * as types from './incomeParticulars_types'

const state = {
  ir56bIncomes: [],
  ir56fIncomes: []
}

const getters = {
  ir56bIncomes: (state) => {
    return state.ir56bIncomes
  },
  ir56fIncomes: (state) => {
    return state.ir56fIncomes
  }
}

const mutations = {
  setIr56bIncomes: (state, payload) => {
    state.ir56bIncomes = payload
  },
  setIr56bIncomePayTypes: (state, payload) => {
    for (var i = 0; i < state.ir56bIncomes.length; i++) {
      if (state.ir56bIncomes[i].id === payload.id) {
        state.ir56bIncomes[i].pay_type_ids = payload.payTypes.map(payType => payType.id)
      }
    }
  },
  setIr56fIncomes: (state, payload) => {
    state.ir56fIncomes = payload
  },
  setIr56fIncomePayTypes: (state, payload) => {
    for (var i = 0; i < state.ir56fIncomes.length; i++) {
      if (state.ir56fIncomes[i].id === payload.id) {
        state.ir56fIncomes[i].pay_type_ids = payload.payTypes.map(payType => payType.id)
      }
    }
  }
}

const actions = {
  // [types.FETCH_IR56B_INCOMES] ({rootGetters, commit}, payload) {
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
  //       console.log('incomeParticular actions FETCH_IR56B_INCOMES: resPonse: ', response)
  //       if (response.data.status) {
  //         commit('setIr56bIncomes', response.data.result)
  //         resolve(response.data.result)
  //       }
  //     })
  //   })
  // },

  // [types.UPDATE_INCOME_PARTICULAR_PAYTYPES] ({rootGetters, commit}, payload) {
  //   commit('setIr56bIncomePayTypes', payload)
  // }
}

export default {
  state,
  getters,
  mutations,
  actions
}
