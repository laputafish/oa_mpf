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
  [types.GENERATE_SAMPLE_FORM] ({rootGetters}, payload) {
    return new Promise((resolve, reject) => {
      let url = constants.apiUrl + '/sample_forms'
      payload.command = 'generate'
      console.log('GENERATE_SAMPLE_FORM :: payload: ', payload)
      Vue.axios.post(url, payload).then(function (response) {
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
