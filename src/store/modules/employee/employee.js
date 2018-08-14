import * as constants from '../../constants'
import * as types from '../employee/employee_types'
import Vue from 'vue'

const state = {
  userEmployee: null,
  roles: []
}

const getters = {
  employee: (state) => {
    return state.employee
  },
  roles: (state) => {
    return state.roles
  },
  isOwner: (state) => {
    let result = false
    if (state.userEmployee) {
      result = state.userEmployee.isOwner
    }
    return result
  },
  isPayrollAdmin: (state) => {
    let result = false
    for (var i = 0; i < state.roles.length; i++) {
      let role = state.roles[i]
      if (role.name === 'Payroll Management') {
        result = true
        break
      }
    }
    return result
  }

}

const mutations = {
  setUserEmployee: (state, payload) => {
    console.log('employee.js :: setUserEmployee :: payload: ', payload)
    state.userEmployee = payload
  },
  setRoles: (state, payload) => {
    state.roles = payload
  }
}

const actions = {
  [types.UPDATE_EMPLOYEE_ID] ({rootGetters}, payload) {
    let user = rootGetters.user
    let url = constants.apiUrl + '/users/' + user.id
    let config = {
      employee_id: payload
    }
    Vue.axios.put(url, config).then(response => {
      if (response.data.status) {
      }
    })
  },

  [types.FETCH_OA_USER_EMPLOYEE] ({rootDispatch, rootGetters, state, commit, dispatch}, payload) {
    return new Promise((resolve, reject) => {
      console.log('FETCH_OA_USER_EMPLOYEE')
      let oaTeamId = rootGetters.user.oa_last_team_id
      let url = constants.oaApiUrl + '/user/employees/self'
      let config = {
        params: {
          teamId: oaTeamId,
          include: 'locations,groups,permissions'
        }
      }
      Vue.axios.get(url, config).then(function (response) {
        console.log('FETCH_OA_USER_EMPLOYEE :: response: ', response)
        if (response.data.status) {
          let oaEmployee = response.data.result
          let groups = oaEmployee.groups
          let employeeId = groups[0]['groupEmployee']['employeeId']
          let roles = oaEmployee.roles
          dispatch('UPDATE_EMPLOYEE_ID', employeeId)
          commit('setUserEmployee', oaEmployee)
          commit('setRoles', roles)
          resolve(oaEmployee)
        }
      })
    })
  },

  [types.FETCH_OA_PERMISSIONS] ({rootDispatch, rootGetters, state, commit, dispatch}, payload) {
    console.log('FETCH_OA_PERMISSIONS')
    let vm = this
    let oaTeamId = rootGetters.user.oa_last_team_id
    let url = constants.oaApiUrl + '/user/employees/' + (payload['employeeId'] ? payload['employeeId'] : 'self')
    let config = {
      params: {
        teamId: oaTeamId,
        include: 'locations,groups,permissions'
      }
    }
    if (payload && payload['oaAuth']) {
      config['headers'] = vm.oaAuth2Headers(payload['oaAuth'])
    }
    return new Promise((resolve, reject) => {
      Vue.axios.get(url, config).then(response => {
        if (response.data.status) {
          let roles = response.data.result.roles
          console.log('FETCH_OA_PERMISSIONS: response: ', response)
          console.log('FETCH_OA_PERMISSIONS: response.data.result.roles: ', response.data.result.roles)
          console.log('FETCH_OA_PERMISSIONS => commit(setRoles, roles) roles: ', roles)
          commit('setRoles', roles)
          console.log('FETCH_OA_PERMISSIONS => resolve(roles)')
          resolve(roles)
        }
      }).catch((error) => {
        reject(error)
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
