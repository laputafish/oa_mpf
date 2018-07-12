import Vue from 'vue'
import * as constants from '@/store/constants'
import * as types from './commencements_types'
// import * as helpers from '@/helpers'

const state = {
  commencementForms: []
}

const getters = {
  commencementForms: (state) => {
    return state.commencementForms
  }
  // ,
  // BLANK_COMMENCEMENT_FORM: () => {
  //   return {
  //     id: 0,
  //     form_no: '',
  //     form_date: helpers.getToday(),
  //     status: 'pending',
  //     subject: '',
  //
  //   }
  // }
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
  },
  [types.SAVE_EMPLOYEE_COMMENCEMENT]: ({rootGetters, commit}, payload) => {
    let form = payload
    return new Promise((resolve, reject) => {
      console.log('SAVE_EMPLOYEE_COMMENCEMENT :: payload: ', payload)
      let url = constants.apiUrl + '/employee_commencements'
      let data = form
      let config = rootGetters.apiHeaderConfig
      Vue.axios.post(url, data, config).then(function (response) {
        if (response.data.status) {
          resolve(response.data.result)
        }
      })
    })
  },
  [types.UPDATE_EMPLOYEE_COMMENCEMENT]: ({rootGetters, commit}, payload) => {
    let form = payload
    return new Promise((resolve, reject) => {
      console.log('SAVE_EMPLOYEE_COMMENCEMENT :: payload: ', payload)
      let url = constants.apiUrl + '/employee_commencements/' + form.id
      let data = form
      let config = rootGetters.apiHeaderConfig
      Vue.axios.put(url, data, config).then(function (response) {
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
