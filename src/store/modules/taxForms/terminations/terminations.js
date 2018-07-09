import Vue from 'vue'
import * as constants from '@/store/constants'
import * as types from './termination_types'

const state = {
  terminationForms: []
}

const getters = {
  terminationForms: (state) => {
    return state.terminationForms
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
