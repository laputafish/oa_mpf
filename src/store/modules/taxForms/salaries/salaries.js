import Vue from 'vue'
import * as constants from '@/store/constants'
import * as types from './salaries_types'

const state = {
  salaryForms: []
}

const getters = {
  salaryForms: (state) => {
    return state.salaryForms
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
