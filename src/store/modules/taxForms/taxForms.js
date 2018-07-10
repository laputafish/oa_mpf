import Vue from 'vue'
import * as constants from '../../constants'
import * as types from './taxForms_types'

const state = {
  showingSelectEmployeeDialog: false,
  selectedFormEmployees: [],
  taxForms: []
}

const getters = {
  showingSelectEmployeeDialog: (state) => {
    return state.showingSelectEmployeeDialog
  },
  employeeIdsWithTaxForm: (state) => {
    if (state.taxForms) {
      return state.taxForms.filter(taxForm => taxForm.status === 'ready').map(taxForm => taxForm.employee_id)
    } else {
      return []
    }
  },
  taxForms: (state) => {
    return state.taxForms
  }
}

const mutations = {
  setTaxForms: (state, payload) => {
    state.taxForms = payload
  },
  showSelectEmployeeDialog: (state) => {
    state.showingSelectEmployeeDialog = true
  },
  hideSelectEmployeeDialog: (state) => {
    state.showingSelectEmployeeDialog = false
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
        console.log('FETCH_TAX_FORMS :: response: ', response)
        commit('setTaxForms', response.data.result)
      })
    }
  },

  [types.GENERATE_SELECTED_TAX_FORMS] ({rootGetters, commit}, payload) {
    return new Promise((resolve, reject) => {
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
          resolve(response.data)
        })
      }
    })
  },

  [types.SHOW_SELECT_EMPLOYEE_DIALOG] ({rootGetters, commit}, payload) {
    commit('showSelectEmployeeDialog')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
