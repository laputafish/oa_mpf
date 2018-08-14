import {app} from '@/main'
import Vue from 'vue'
import * as constants from '../../constants'
import * as types from './groups_types'

const state = {
  selectedEmployeeIds: [],
  selectingEmployeeIds: [],
  activeEmployeeId: -1,
  hoveringEmployeeId: -1,
  groups: [],
  employees: [],
  selectedGroup: null
}

const moveChild = (groupList, pos) => {
  let parentId = groupList[pos].parentId
  let k
  for (k = 0; k < pos; k++) {
    if (groupList[k].id === parentId) {
      groupList[k].children.push(groupList[pos])
      groupList.splice(pos, 1)
      break
    }
  }
  return groupList
}

const showGroup = (group) => {
//  console.log('id=' + group.id + ' parent id=' + group.parentId + '  children count=' + group.children.length)
}

const sortGroupByName = (groupList) => {
  for (var i = 0; i < groupList.length; i++) {
    if (groupList.children && groupList.children.length > 0) {
      groupList.children = sortGroupByName(groupList.children)
    }
  }
  return groupList.sort(function (group1, group2) {
    return group1.name > group2.name
  })
}

const getters = {
  selectingEmployeeIds: state => {
    return state.selectingEmployeeIds
  },
  selectedEmployeeIds: state => {
    return state.selectedEmployeeIds
  },
  hoveringEmployeeId: state => {
    return state.hoveringEmployeeId
  },
  activeEmployeeId: state => {
    return state.activeEmployeeId
  },
  employees: state => {
    return state.selectedGroup === null
      ? (state.employees ? state.employees : [])
      : state.selectedGroup.employees
  },
  isAllEmployeesSelected: (state) => {
    let result = false
    let employee
    if (state.selectedGroup) {
      result = true
      let employees = state.selectedGroup.id === 0
        ? state.employees
        : state.selectedGroup.employees

      for (var i = 0; i < employees.length; i++) {
        employee = state.selectedGroup.employees[i]
        if (state.selectedEmployeeIds.indexOf(employee.id) === -1) {
          result = false
          break
        }
      }
    }
    return result
  },
  selectedGroup: (state) => {
    return state.selectedGroup
  },
  groups: (state) => {
    return state.groups
  },
  groupTree: (state) => {
    let result = []
    let i
    for (i = 0; i < state.groups.length; i++) {
      state.groups[i].children = []
      result.push(state.groups[i])
    }
    result.sort(function (a, b) {
      if (a.parentId === null) {
        if (b.parentId === null) {
          return parseInt(a.id) - parseInt(b.id)
        } else {
          return -1
        }
      } else {
        if (b.parentId === null) {
          return 1
        } else {
          return parseInt(a.id) - parseInt(b.id)
        }
      }
    })

    console.log('sort :: result.length = ' + result.length)
    for (i = result.length - 1; i >= 0; i--) {
      console.log('i=' + i)
      showGroup(result[i])
      if (result[i].parentId !== null) {
        result = moveChild(result, i)
        console.log('SORTED groups: ', result)
        for (let j = 0; j < result.length; j++) {
          showGroup(result[j])
        }
      } else {
        break
      }
    }

    result = sortGroupByName(result)
    console.log('getters.groupTree: app: ', app)

    let rootGroup = {
      id: 0,
      employees: state.employees,
      nameTag: 'general.all_staff',
      children: result
    }
    // if (state.selectedGroup === null) {
    //   state.selectedGroup = state.rootGroup
    // }

    return [rootGroup]
  }
}

const mutations = {
  setEmployees: (state, payload) => {
    state.employees = payload
  },
  setGroups: (state, payload) => {
    state.groups = payload
  },
  clearEmployeeSelection: (state) => {
    state.selectedEmployeeIds = []
  },
  selectGroup: (state, payload) => {
    state.selectedGroup = payload
    //
    // if (payload.id === 0) {
    //   state
    // }
    // for (var i = 0; i < state.groups.length; i++) {
    //   if (state.groups[i] === payload) {
    //     state.selectedGroup = state.groups[i]
    //     break
    //   }
    // }
  },
  setSelectedEmployeeIds: (state, payload) => {
    state.selectedEmployeeIds = payload
  },

  appendEmployeeId: (state, payload) => {
    state.selectedEmployeeIds.push(payload)
  },

  removeSelectedEmployeeIdByIndex: (state, payload) => {
    state.selectedEmployeeIds.splice(payload, 1)
  },

  setActiveEmployeeId: (state, payload) => {
    state.activeEmployeeId = payload
    state.selectingEmployeeIds = []
  },

  setHoveringEmployeeIdActive: (state) => {
    console.log('groups.js :: setHoveringEmployeeIdToActive employee.id = ' + state.hoveringEmployeeId)
    state.activeEmployeeId = state.hoveringEmployeeId
    if (state.selectedEmployeeIds.indexOf(state.hoveringEmployeeId) === -1) {
      state.selectedEmployeeIds.push(state.hoveringEmployeeId)
    }
  },

  setHoveringEmployeeId: (state, payload) => {
    state.hoveringEmployeeId = payload
  },

  clearSelectingEmployeeIds: state => {
    state.selectingEmployeeIds = []
  },

  setSelectingEmployeeIds: () => {
    state.selectingEmployeeIds = []
    if (state.activeEmployeeId !== -1 && state.hoveringEmployeeId !== -1) {
      let employees = state.selectedGroup.employees
      let p1 = employees.findIndex(employee => { return employee.id === state.activeEmployeeId })
      let p2 = employees.findIndex(employee => { return employee.id === state.hoveringEmployeeId })
      if (p1 > p2) {
        let tmp = p1
        p1 = p2
        p2 = tmp
      }
      for (var i = p1; i <= p2; i++) {
        state.selectingEmployeeIds.push(employees[i].id)
      }
    }
  }
}

const actions = {
  async [types.SET_HOVERING_EMPLOYEE_ID_ACTIVE] ({commit}) {
    commit('setHoveringEmployeeIdActive')
  },
  async [types.TOGGLE_TO_EMPLOYEE] ({state, commit}, payload) {
    let targetEmployeeId = payload
    if (state.activeEmployeeId !== 0) {
      let employees = state.selectedGroup.employees
      let p1 = employees.findIndex(employee => { return employee.id === state.activeEmployeeId })
      let p2 = employees.findIndex(employee => { return employee.id === targetEmployeeId })
      let i
      if (p1 > p2) {
        let tmp = p1
        p1 = p2
        p2 = tmp
      }
      let isRangeAllSelected = true
      for (i = p1; i <= p2; i++) {
        if (state.selectedEmployeeIds.indexOf(employees[i].id) === -1) {
          isRangeAllSelected = false
          break
        }
      }

      if (isRangeAllSelected) {
        // remove from selection
        let p
        for (i = p1; i <= p2; i++) {
          p = state.selectedEmployeeIds.indexOf(employees[i].id)
          commit('removeSelectedEmployeeIdByIndex', p)
        }
        commit('setActiveEmployeeId', -1)
      } else {
        // append to selection
        for (i = p1; i <= p2; i++) {
          if (state.selectedEmployeeIds.indexOf(employees[i].id) === -1) {
            commit('appendEmployeeId', employees[i].id)
          }
        }
      }
    }
  },

  async [types.TOGGLE_EMPLOYEE_SELECTION] ({state, commit}, payload) {
    let employee = payload
    let p = state.selectedEmployeeIds.indexOf(employee.id)
    if (p === -1) {
      commit('appendEmployeeId', employee.id)
      commit('setActiveEmployeeId', employee.id)
    } else {
      console.log('TOGGLE_EMPLOYEE_SELEDCTION p = ' + p)
      commit('removeSelectedEmployeeIdByIndex', p)
      commit('setActiveEmployeeId', -1)
    }
  },

  async [types.CLEAR_EMPLOYEE_SELECTION] ({commit}) {
    commit('clearEmployeeSelection')
  },

  async [types.SELECT_ALL_EMPLOYEES] ({getters, commit}) {
    let result = []
    for (var i = 0; i < getters.employees.length; i++) {
      result.push(getters.employees[i].id)
    }
    commit('setSelectedEmployeeIds', result)
  },

  async [types.SELECT_GROUP] ({commit}, payload) {
    commit('selectGroup', payload)
  },

  async [types.CLEAR_GROUP_SELECTION] ({commit}) {
    commit('clearGroupSelection')
  },

  async [types.CLEAR_EMPLOYEE_SELECTION] ({commit}) {
    commit('clearEmployeeSelection')
  },

  async [types.FETCH_OA_GROUPS] ({rootGetters, state, commit, dispatch, getters}) {
    console.log('groups.js :: FETCH_OA_GROUPS : rootGetters.user: ', rootGetters.user)
    console.log('groups.js :: FETCH_OA_GROUPS : rootGetters.user.oa_last_item_id = ' + rootGetters.user.oa_last_team_id)

    if (rootGetters.user && rootGetters.user.oa_last_team_id) {
      let url = constants.oaApiUrl + '/user/groups'
      console.log('FETCH_OA_GROUPS: url=' + url)
      let config = {
        params: {
          teamId: rootGetters.user.oa_last_team_id
        }
      }
      Vue.axios.get(url, config).then(response => {
        console.log('url = ' + url + ' :: response:', response)
        if (response.data.status) {
          console.log('FETCH_OA_GROUPS :: response.data.result : ', response.data.result)
          commit('setGroups', response.data.result)
        } else {
          console.log('FETCH_OA_GROUPS fails')
        }
      })
    } else {
      commit('setGroups', [])
    }
  },

  async [types.FETCH_EMPLOYEES] ({rootGetters, state, commit, dispatch, getters}, payload) {
    let vm = this
    let url = constants.oaApiUrl + '/admin/employees'
    let status = 'active'

    if (payload && payload['status']) {
      status = payload['status']
    }

    let config = {
      'params': {
        status: status,
        include: 'groups,workingGroups,permissions',
        teamId: rootGetters.user.oa_last_team_id
      }
    }
    if (payload && payload['oaAuth']) {
      config['headers'] = vm.oaAuth2Headers(payload['oaAuth'])
    }
    console.log('types.FETCH_EMPLOYEES :: before axios.get')
    await Vue.axios.get(url, config).then(response => {
      if (response.data.status) {
        commit('setEmployees', response.data.result)
        console.log('FETCH_EMPLOYEES: employees: ', response.data.result)
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
