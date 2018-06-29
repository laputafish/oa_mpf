import {app} from '@/main'
import Vue from 'vue'
import * as constants from '../../constants'
import * as types from './groups_types'

const state = {
  groups: []
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
  console.log('id=' + group.id + ' parent id=' + group.parentId + '  children count=' + group.children.length)
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
    return [{
      id: 0,
      name: app.$t('general.all_staff'),
      children: result
    }]
  }
}

const mutations = {
  setGroups: (state, payload) => {
    state.groups = payload
  }
}

const actions = {
  async [types.FETCH_GROUPS] ({rootGetters, state, commit, dispatch, getters}) {
    let url = constants.oaApiUrl + '/admin/groups'
    console.log('FETCH_GROUPS: url=' + url)
    let config = rootGetters.oaApiHeaderConfig
    config['params'] = {
      teamId: rootGetters.activeTeamId
    }
    await Vue.axios.get(url, config).then(response => {
      if (response.data.status) {
        console.log('FETCH_GROUPS :: response.data.result : ', response.data.result)
        commit('setGroups', response.data.result)
      } else {
        console.log('fetch groups fails')
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
