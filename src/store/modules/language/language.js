import Vue from 'vue'
import * as constants from '@/store/constants'
import * as types from './language_types'

const state = {
  languages: []
}
const getters = {
  languages: (state) => {
    return state.languages
  }
}

const mutations = {
  setLanguages: (state, payload) => {
    state.languages = payload
  }
}

const actions = {
  [types.FETCH_LANGUAGES] ({commit}) {
    let url = constants.apiUrl + '/langs'
    Vue.axios.get(url).then(function (response) {
      if (response.data.status) {
        commit('setLanguages', response.data.result)
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
