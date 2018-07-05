import Vue from 'vue'
import * as constants from '../../constants'
import * as types from './taxForms_types'

const state = {
  taxForms: []
}

const getters = {
  employeeIdsWithTaxForm: (state) => {
    if (state.taxForms) {
      return state.taxForms.map(taxForm => taxForm.employee_id)
    } else {
      return []
    }
  }
}

const mutations = {
  setTaxForms: (state, payload) => {
    state.taxForms = payload
  }
}

const actions = {
  async [types.FETCH_TAX_FORMS] ({rootGetters, commit}, payload) {
    if (rootGetters.teamId) {
      let teamId = rootGetters.teamId
      let fiscalYear = payload
      let url = constants.apiUrl + '/tax_forms'
      let config = {
        ...rootGetters.apiHeaderConfig,
        params: {
          teamId: teamId,
          fiscalYear: fiscalYear
        }
      }
      Vue.axios.get(url, config).then(function (response) {
        commit('setTaxForms', response.data.result)
      })
    }
  },

  async [types.GENERATE_SELECTED_TAX_FORMS] ({rootGetters, commit}, payload) {
    console.log('rootGetters.teamId: ', rootGetters.teamId)
    if (rootGetters.teamId) {
      let url = constants.apiUrl + '/tax_forms'
      let data = {
        teamId: rootGetters.teamId,
        fiscalYear: payload,
        employeeIds: rootGetters.selectedEmployeeIds,
        command: 'generate'
      }
      let config = rootGetters.apiHeaderConfig
      Vue.axios.post(url, data, config).then(function (response) {
      })
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
