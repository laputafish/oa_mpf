import Vue from 'vue'
import * as constants from '../../constants'
import * as types from './taxForms_types'
// import * as helpers from '@/helpers'

const state = {
  showingSelectEmployeeDialog: false,
  selectedFormEmployeeIds: [],
  taxForms: [],
  activeForm: null
}

const getters = {
  showingSelectEmployeeDialog: (state) => {
    return state.showingSelectEmployeeDialog
  },
  selectedFormEmployeeIds: (state) => {
    return state.selectedFormEmployeeIds
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
  },
  activeForm: (state) => {
    return state.activeForm
  }
}

const mutations = {
  setTaxForms: (state, payload) => {
    state.taxForms = payload
  },
  showSelectEmployeeDialog: (state) => {
    state.showingSelectEmployeeDialog = true
    // console.log('showSelectEmployeeDialog :: showingSelectEmployeeDialog = ' +
    //   state.showingSelectEmployeeDialog)
  },
  hideSelectEmployeeDialog: (state) => {
    state.showingSelectEmployeeDialog = false
  },
  setSelectedFormEmployeeIds: (state, payload) => {
    state.selectedFormEmployeeIds = payload
  },
  setActiveForm: (state, payload) => {
    // console.log('taxForms.js :: setActiveForm: payload: ', payload)
    state.activeForm = payload
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
        // console.log('FETCH_TAX_FORMS :: response: ', response)
        commit('setTaxForms', response.data.result)
      })
    }
  },

  [types.GENERATE_SELECTED_TAX_FORMS] ({rootGetters, commit}, payload) {
    return new Promise((resolve, reject) => {
      // console.log('rootGetters.teamId: ', rootGetters.teamId)
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

  // [types.SHOW_SELECT_EMPLOYEE_DIALOG] ({rootGetters, commit}, payload) {
  //   console.log('taxForm :: SHOW_SELECT_EMPLOYEE_DIALOG :: payload: ', payload)
  //   let selectedEmployeeIds = payload
  //   commit('setSelectedFormEmployeeIds', selectedEmployeeIds)
  //   commit('showSelectEmployeeDialog')
  // },

  async [types.SET_SELECTED_FORM_EMPLOYEE_IDS] ({rootGetters, commit}, payload) {
    await commit('setSelectedFormEmployeeIds', payload)
  },

  // [types.SET_BLANK_ACTIVE_FORM] ({rootGetters, commit}, payload) {
  //   let formType = payload
  //   switch (formType) {
  //     case 'commencement':
  //       commit('setActiveForm', rootGetters.BLANK_COMMENCEMENT_FORM)
  //       break
  //     case 'termination':
  //       commit('setActiveForm', rootGetters.BLANK_TERMINATION_FORM)
  //       break
  //     case 'departure':
  //       commit('setActiveForm', rootGetters.BLANK_DEPARTURE_FORM)
  //       break
  //     case 'salary':
  //       commit('setActiveForm', rootGetters.BLANK_SALARY_FORM)
  //       break
  //   }
  // },

  [types.SET_ACTIVE_FORM] ({rootGetters, commit}, payload) {
    // console.log('SET_ACTIVE_FORM')
    let form = payload
    let employees = rootGetters.employees
    let employeeIds = employees.map(employee => employee.id)
    for (var i = 0; i < form.employees.length; i++) {
      let index = employeeIds.indexOf(form.employees[i].id)
      form.employees[i].info = employees[index]
    }
    commit('setActiveForm', form)
  },

  [types.FETCH_ACTIVE_FORM] ({rootGetters, dispatch}, payload) {
    // console.log('FETCH_ACTIVE_FORM')
    return new Promise((resolve, reject) => {
      let formId = payload.id
      let url = constants.apiUrl + '/forms/' + formId
      let config = rootGetters.apiHeaderConfig

      Vue.axios.get(url, config).then(function (response) {
        if (response.data.status) {
          dispatch('SET_ACTIVE_FORM', response.data.result)
          resolve(response.data.result)
        }
      })

      // }
    })
  },

  [types.FETCH_ACTIVE_FORMX] ({rootGetters, dispatch}, payload) {
    // console.log('FETCH_ACTIVE_FORM')
    return new Promise((resolve, reject) => {
      let formId = payload.id
      let formType = payload.type

      // if (formId === 0) {
      //   dispatch('SET_BLANK_ACTIVE_FORM', formType)
      // } else {
      let formTypePath = ''
      switch (formType) {
        case 'commencement':
          formTypePath = '/employee_commencements/'
          break
        case 'departure':
          formTypePath = '/employee_departures/'
          break
        case 'termination':
          formTypePath = '/employee_terminations/'
          break
        case 'salary':
          formTypePath = '/employee_salaries/'
          break
      }

      let url = constants.apiUrl + formTypePath + formId
      let config = rootGetters.apiHeaderConfig

      Vue.axios.get(url, config).then(function (response) {
        if (response.data.status) {
          // console.log('FETCH_ACTIVE_FORM axios => SET_ACTIVE_FORM :: response:', response)
          dispatch('SET_ACTIVE_FORM', response.data.result)
        }
      })

      // }
    })
  },

  [types.START_FORM_GENERATION] ({rootGetters, commit}, payload) {
    let formId = payload.formId
    let formType = payload.formType

    let url = constants.apiUrl + '/tax_forms'
    let config = rootGetters.apiHeaderConfig
    let data = {
      'command': 'generate',
      'formId': formId,
      'formType': formType
    }
    Vue.axios.post(url, data, config)
  },

  [types.TERMINATE_FORM_GENERATION] ({rootGetters, commit}, payload) {
    let formId = payload.formId
    let formType = payload.formType

    let url = constants.apiUrl + '/tax_forms'
    let config = rootGetters.apiHeaderConfig
    let data = {
      'command': 'terminate',
      'formId': formId,
      'formType': formType
    }
    Vue.axios.post(url, data, config)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
