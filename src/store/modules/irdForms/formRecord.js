import Vue from 'vue'
import * as constants from '@/store/constants'
import * as types from './formRecord_types'

const state = {
}

const getters = {
}

const mutations = {
}

const actions = {
  [types.FETCH_FORM_RECORD]: ({rootGetters, commit}, payload) => {
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
  },
  [types.REMOVE_FORM_RECORD]: ({rootGetters, commit}, payload) => {
    let formId = payload
    return new Promise((resolve, reject) => {
      let url = constants.apiUrl + '/forms/' + formId
      Vue.axios.delete(url).then(function (response) {
        if (response.data.status) {
          resolve(true)
        } else {
          reject(new Error('server error'))
        }
      }, function (error) {
        reject(error)
      })
    })
  },
  [types.SAVE_FORM_RECORD]: ({rootGetters, commit}, payload) => {
    let form = payload
    return new Promise((resolve, reject) => {
      let url = constants.apiUrl + '/forms'
      let data = form
      let config = rootGetters.apiHeaderConfig
      Vue.axios.post(url, data, config).then(function (response) {
        if (response.data.status) {
          resolve(response.data.result)
        }
      })
    })
  },
  [types.UPDATE_FORM_RECORD]: ({rootGetters, commit}, payload) => {
    let form = payload
    return new Promise((resolve, reject) => {
      console.log('SAVE_EMPLOYEE_COMMENCEMENT :: payload: ', payload)
      let url = constants.apiUrl + '/forms/' + form.id
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
