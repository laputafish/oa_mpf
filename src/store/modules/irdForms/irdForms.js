import Vue from 'vue'
import * as constants from '@/store/constants'
import * as types from './irdForms_types'

const state = {
  irdFormTypes: []
}

const getters = {
  irdFormTypes: (state) => {
    return state.irdFormTypes
  }
}

const mutations = {
  setIrdFormTypes: (state, payload) => {
    state.irdFormTypes = payload
  }
}

const actions = {
  [types.FETCH_IRD_FORM_TYPES] ({rootGetters, commit}) {
    let url = constants.apiUrl + '/ird_form_types'
    let config = rootGetters.apiHeaderConfig
    Vue.axios.get(url, config).then(response => {
      if (response.data.status) {
        commit('setIrdFormTypes', response.data.result)
      }
    })
  },

  // [types.FETCH_IRD_FORMS] ({rootGetters, commit}, payload) {
  //   let query = payload
  //   let page = Math.floor(query.offset / query.limit)
  //   let url = constants.apiUrl + '/ird_forms'
  //   let config = {
  //     ...rootGetters.apiHeaderConfig,
  //     params: {
  //       ...query,
  //       page: page
  //     }
  //   }
  //   Vue.axios.get(url, config).then(function (response) {
  //     if (response.data.status) {
  //       commit('setIrdForms', response.data.result)
  //     }
  //   })
  // },

  [types.FETCH_FORMS] ({rootGetters, commit}, payload) {
    let query = payload
    let page = Math.floor(query.offset / query.limit)
    return new Promise((resolve, reject) => {
      let url = constants.apiUrl + '/forms'
      let config = {
        ...rootGetters.apiHeaderConfig,
        params: {
          ...query,
          page: page
        }
      }
      Vue.axios.get(url, config).then(function (response) {
        if (response.data.status) {
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
