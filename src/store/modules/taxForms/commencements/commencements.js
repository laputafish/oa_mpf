import Vue from 'vue'
import * as constants from '@/store/constants'
import * as types from './commencements_types'

const state = {
  commencementForms: []
}

const getters = {
  commencementForms: (state) => {
    return state.commencementForms
  }
}

const mutations = {

}

const actions = {
  [types.FETCH_EMPLOYEE_COMMENCEMENTS]: ({rootGetters, commit}, payload) => {
    let query = payload
    let page = Math.floor(query.offset / query.limit)
    return new Promise((resolve, reject) => {
      console.log('FETCH_EMPLOYEE_COMMENCEMENTS :: payload: ', payload)
      let url = constants.apiUrl + '/employee_commencements'
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
