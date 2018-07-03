import Vue from 'vue'
import * as constants from '../../constants'
import * as types from './employees_types'

const state = {
  selectedEmployeeIds: [],
  employees: [],
  groups: []
}

const getters = {
  employees: state => {
    return state.employees
  },
  selectedEmployeeIds: state => {
    return state.selectedEmployeeIds
  },
  isAllEmployeesSelected: state => {
    let result = true
    for (var i = 0; i < state.employees.length; i++) {
      if (state.selectedEmployeeIds.indexOf(state.employees[i].id) === -1) {
        result = false
        break
      }
    }
    return result
  }
  // employeesOfSelectedGroup: state => (group, search) => {
  //   let employees = []
  //   if (group === null || group.id === 0) {
  //     employees = state.employees
  //   } else {
  //     employees = group.employees
  //   }
  //   if (search.length >= 3) {
  //     employees = employees.filter(employee => {
  //       return employee.displayName.toLowerCase().indexOf(search.toLowerCase()) >= 0
  //     })
  //   }
  //   return employees
  //
  // }
}

const mutations = {

  isAllSelected: (state) => {
    let result = true
    let employee
    for (var i = 0; i < state.employees.length; i++) {
      employee = state.employees[i]
      if (state.selectedEmployeeIds.indexOf(employee.id) === -1) {
        result = false
        break
      }
    }
    return result
  },
  clearSelection: (state) => {
    state.selectedEmployeeIds = []
  }
}

const actions = {
  async [types.CLEAR_EMPLOYEE_SELECTION] ({commit}) {
    commit('clearSelection')
  },
  async [types.SELECT_ALL_EMPLOYEES] ({state}) {
    let result = []
    for (var i = 0; i < state.employees.length; i++) {
      result.push(state.employees[i].id)
    }
    return result
  },

  async [types.FETCH_EMPLOYEES] ({rootGetters, state, commit, dispatch, getters}) {
    let url = constants.oaApiUrl + '/user/employees'
    let config = rootGetters.oaApiHeaderConfig
    config['params'] = {
      state: 'active',
      include: 'groups,workingGroups,permissions',
      teamId: rootGetters.user.oa_last_team_id
    }
    await Vue.axios.get(url, config).then(response => {
      if (response.data.status) {
        commit('setEmployees', response.data.result)
        console.log('FETCH_EMPLOYEES: employees: ', response.data.result)
      }
    })
  },

  async [types.SELECT_EMPLOYEE] ({commit}, payload) {
    commit('selectEmployee', payload)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
