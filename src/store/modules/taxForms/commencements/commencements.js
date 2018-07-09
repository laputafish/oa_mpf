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

}

export default {
  state,
  getters,
  mutations,
  actions
}
