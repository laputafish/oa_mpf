import * as types from './sampleForms_types'
import * as constants from '../../constants'
import Vue from 'vue'

const state = {

}

const getters = {

}

const mutations = {

}

const actions = {
  [types.TERMINATE_IRD_REQUEST_FORM_GENERATION] (context, payload) {
    return new Promise((resolve, reject) => {
      let url = constants.apiUrl + '/sample_forms'
      let data = {
        command: 'terminate'
      }
      Vue.axios.post(url, data).then(function (response) {
        if (response.data.status) {
          resolve(response.data.result)
        }
      })
    })
  },
  [types.GENERATE_IRD_REQUEST_FORM] (context, payload) {
    return new Promise((resolve, reject) => {
      let url = constants.apiUrl + '/sample_forms'
      payload.command = 'generate'
      Vue.axios.post(url, payload).then(function (response) {
        if (response.data.status) {
          resolve(response.data.result)
        }
      })
    })
  },

  [types.UPDATE_APPROVAL_REQUEST_FORM] ({rootGetters}, payload) {
    return new Promise((resolve, reject) => {
      let url = constants.apiUrl + '/sample_forms'
      Vue.axios.post(url, payload).then(function (response) {
        if (response.data.status) {
          resolve(response.data.result)
        }
      })
    })
  },

  [types.FETCH_SAMPLE_FORM] () {
    return new Promise((resolve, reject) => {
      let url = constants.apiUrl + '/sample_forms/0'
      Vue.axios.get(url).then(function (response) {
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
