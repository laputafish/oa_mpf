import {app} from '@/main'
import Vue from 'vue'
import * as constants from '../../constants'
import * as types from './groups_types'

const state = {
  selectedEmployeeIds: [],
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
  employees: state => {
    return state.selectedGroup === null
      ? []
      : state.selectedGroup.employees
  },
  selectedEmployeeIds: state => {
    return state.selectedEmployeeIds
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
  }
}

const actions = {
  async [types.SELECT_GROUP] ({commit}, payload) {
    commit('selectGroup', payload)
  },

  async [types.CLEAR_GROUP_SELECTION] ({commit}) {
    commit('clearGroupSelection')
  },

  async [types.CLEAR_EMPLOYEE_SELECTION] ({commit}) {
    commit('clearEmployeeSelection')
  },

  async [types.FETCH_GROUPS] ({rootGetters, state, commit, dispatch, getters}) {
    console.log('groups.js :: FETCH_GROUPS : rootGetters.user: ', rootGetters.user)
    console.log('groups.js :: FETCH_GROUPS : rootGetters.user.oa_last_item_id = ' + rootGetters.user.oa_last_team_id)

    if (rootGetters.user && rootGetters.user.oa_last_team_id) {
      let url = constants.oaApiUrl + '/admin/groups'
      console.log('FETCH_GROUPS: url=' + url)
      let config = rootGetters.oaApiHeaderConfig
      console.log('FETCH_GORUPS: config: ', config)
      config['params'] = {
        teamId: rootGetters.user.oa_last_team_id
      }
      await Vue.axios.get(url, config).then(response => {
        console.log('url = ' + url + ' :: response:', response)
        if (response.data.status) {
          console.log('FETCH_GROUPS :: response.data.result : ', response.data.result)
          commit('setGroups', response.data.result)
        } else {
          console.log('fetch groups fails')
        }
      })
    } else {
      commit('setGroups', [])
    }
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
  }

}

export default {
  state,
  getters,
  mutations,
  actions
}