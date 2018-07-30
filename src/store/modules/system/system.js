import Vue from 'vue'
import {app} from '@/main'
import * as constants from '../../constants'

import Cookie from 'cookie'
import Cookies from 'js-cookie'
import * as types from './system_types'
import data from '../data.json'
import moment from 'moment'

const state = {
  ...data,
  token: null,
  //  oaAuth: null,
  // tokenType: "JWT"
  // accessToken: "ey....cA",
  // expiresIn: 30
  // refreshToken: "21..aH"

  email: '',
  user: null,
  activeTeam: null,
  // user.oa_token_type
  // user.oa_access_token
  // user.oa_expires_in
  // user.oa_refresh_token

  isSupervisor: false,
  activeMenu: '',
  publicFolder: null,
  availableFiscalStartYears: []
}

const transformFolders = folders => {
  let result = []
  for (var i = 0; i < folders.length; i++) {
    result.push({
      name: folders[i].name,
      expanded: true,
      children: folders[i].children ? transformFolders(folders[i].children) : []
    })
  }
  return result
}

const getters = {
  availableFiscalStartYears: (state) => {
    return state.availableFiscalStartYears
  },
  cookieToken (state) {
    const cookieStr = process.browser ? document.cookie : this.app.context.req.headers.cookie
    const cookies = Cookie.parse(cookieStr || '') || {}
    return cookies['ccmsToken']
  },

  token (state) {
    return state.token
  },
  oaApiHeaderConfig (state) {
    return state.user ? {
      headers: {
        'Authorization': state.user.oa_token_type + ' ' + state.user.oa_access_token,
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*'
      }
    } : null
  },
  apiHeaderConfig (state) {
    return {
      headers: {
        'Authorization': 'Bearer ' + state.token,
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*'
      }
    }
  },
  oaToken (state) {
    return state.user ? state.user.oa_access_token : ''
  },
  loggedIn (state) {
    console.log('store :: getters.loggedIn')
    return Boolean(state.user && state.token)
  },
  user (state) {
    console.log('store :: getters.user: ', state.user)
    return state.user
  },
  teamId (state) {
    let result = null
    if (state.user) {
      if (state.user.oa_last_team_id) {
        if (state.user.oa_last_team_id !== null && state.user.oa_last_team_id !== 0) {
          result = state.user.oa_last_team_id
        }
      }
    }
    return result
  },
  userFolders (state) {
    let result = []
    if (state.user) {
      let folder = state.user.folder
      result = [{
        name: folder.name,
        expanded: true,
        children: folder.children ? transformFolders(folder.children) : []
      }]
    }
    return result
  },
  publicFolder (state) {
    return state.publicFolder
  },
  publicScanFolder (state) {
    console.log('publicScanFolder :: publicFolder:', state.publicFolder)
    let result = null
    let childFolder = null
    if (state.publicFolder) {
      if (state.publicFolder.children) {
        for (var i = 0; i < state.publicFolder.children.length; i++) {
          childFolder = state.publicFolder.children[i]
          console.log('publicFolder.children[' + i + ']: publicFolder.children[i].name = ' + childFolder.name)
          if (childFolder.name === 'scan') {
            result = childFolder
            break
          }
        }
      }
    }
    return result
  },
  userScanFolder (state) {
    let result = null
    if (state.user && state.user.folders) {
      console.log('userScanFolder :: folders:', state.user.folders)
      for (var i = 0; i < state.user.folders.length; i++) {
        if (state.user.folders[i].name === 'scan') {
          result = state.user.folders[i]
          break
        }
      }
    }
    return result
  },
  productsByCategory (state) {
    return (categoryId) => {
      return state.products.filter((product) => {
        return product.category_id === categoryId
      })
    }
  },
  categoryTree: (state) => {
    return state.categoryRoot
  }
}

function getCategory (categoryId, categoryNode) {
  if (typeof categoryNode === 'undefined') {
    categoryNode = state.categoryRoot
  }
  let result = null
  if (categoryId === categoryNode.id) {
    result = categoryNode
  } else {
    if (categoryNode.children) {
      for (var i = 0; i < categoryNode.children.length; i++) {
        var child = categoryNode.children[i]
        console.log('store :: getCategory i=' + i + ': child.name = ' + child.name)
        result = getCategory(categoryId, child)
        if (result) {
          break
        }
        //
        // if (child.id === categoryId) {
        //   result = child
        //   break
        // } else {
        //   console.log('getCategory :: child: ', child)
        //   if (child.children) {
        //     result = getCategory(categoryId, child)
        //     if (result) {
        //       break
        //     }
        //   }
        // }
      }
    }
  }
  return result
}

function getCategoryParent (categoryId, categoryNode) {
  console.log('store :: getCategoryParent :: categoryId: ', categoryId)
  if (typeof categoryNode === 'undefined') {
    categoryNode = state.categoryRoot
  }
  let result = null
  console.log('store :: getCategoryParent :: categoryNode.children.length = ' + categoryNode.children.length)
  for (var i = 0; i < categoryNode.children.length; i++) {
    var children = categoryNode.children[i]
    console.log('store :; getCategoryParent :: check i=' + i + ' child#' + children.id + ' "' + children.name)
    if (children.id === categoryId) {
      result = categoryNode
      break
    } else {
      if (children.children) {
        result = getCategoryParent(categoryId, children)
        if (result) {
          break
        }
      }
    }
  }
  return result
}

function moveCategory (category, afterParent, beforeParent) {
  // remove child from before parent
  console.log('store :: moveCategory: beforeParent: ', beforeParent)
  for (var i = 0; i < beforeParent.children.length; i++) {
    if (beforeParent.children[i].id === category.id) {
      beforeParent.children.splice(i, 1)
      break
    }
  }
  // add child to after parent
  afterParent.children.push(category)
}

function getFiscalYearOfDate (theDate) {
  let d = moment(theDate)
  let year = d.get('year')
  let cutoffDate = moment(year + '-04-01')
  return d < cutoffDate ? (year - 1) : year
}

const mutations = {

  setLang (state, payload) {
    app.$i18n.locale = payload
  },

  setUser (state, payload) {
    state.user = payload.user
    // if (typeof payload.callback === 'function') {
    //   payload.callback(true, state.isSupervisor)
    // }
  },
  setToken (state, token) {
    // localStorage.setItem('token', token)
    state.token = token
    // Vue.axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
    // Vue.axios.defaults.headers.common['Content-Type'] = 'application/json'
    // Vue.axios.defaults.headers.common['Accept'] = 'application/json'
    // console.log('store :: setToken :: localStorage.setItem :: token = ' + token)
  },
  setEmployeeId (state, payload) {
    state.user.employee_id = payload
  },
  [types.SET_ACTIVE_MENU] (state, data) {
    state.activeMenu = data
  },
  [types.REPOSITION_CATEGORY] (state, payload) {
    let afterParent = getCategory(payload.afterParent.id)
    let beforeParent = getCategory(payload.beforeParent.id)
    let item = getCategory(payload.data.id)

    console.log('store :: REPOSITION_CATEGORY : afterParent.id = ' + payload.afterParent.id)
    console.log('store :: REPOSITION_CATEGORY : beforeParent.id = ' + payload.beforeParent.id)

    console.log('store :: system.js :: REPOSITION_CATEGORY :: item: ', item)
    let currentParent = getCategoryParent(item)
    console.log('store :: system.js :: REPOSITION_CATEGORY :: currentParent is ' + currentParent.name)

    if (currentParent.id !== afterParent.id) {
      moveCategory(item, afterParent, beforeParent)
    }
  },
  removeCategoryChild (state, payload) {
    let parentId = payload.parentId
    let itemId = payload.itemId
    console.log('store :: removeCategoryChild :: parentId = ' + parentId)
    console.log('store :: removeCategoryChild :: itemId = ' + itemId)
    let parent = getCategory(parentId)
    let item = getCategory(itemId)

    let index = parent.children.indexOf(item)
    console.log('store :: removeCategoryChild :: index = ' + index)

    parent.children.splice(index, 1)
  },
  appendCategoryChild (state, payload) {
    let parentId = payload.parentId
    let item = payload.item
    let parent = getCategory(parentId)
    if (!parent.children) {
      parent.children = []
    }
    parent.children.push(item)
  },
  insertCategoryChild (state, payload) {
    let parentId = payload.parentId
    let item = payload.item
    let index = payload.index

    let parent = getCategory(parentId)
    if (!parent.children) {
      parent.children = []
    }
    parent.children.splice(index, 0, item)
  },
  setPublicFolder (state, payload) {
    state.publicFolder = payload
  },

  setOAAuth (state, payload) {
    state.oaAuth = payload
  },

  setActiveTeam (state, payload) {
    state.activeTeam = payload
    state.user.oa_last_team_id = payload.id
  },

  setCookieToken (state, token) {
    console.log('setCookieToken: token:', token)
    Cookies.set('ccmsToken', token, {expires: 1})
  },

  removeCookieToken () {
    Cookies.remove('ccmsToken')
  },

  setAvailableFiscalStartYears (state, payload) {
    console.log('setAvailableFiscalStartYears: payload:', payload)
    let startedDate = payload.startedDate
    let endedDate = payload.endedDate
    let startFiscalYearStartYear = getFiscalYearOfDate(startedDate)
    let endFiscalYearStartYear = getFiscalYearOfDate(endedDate)
    state.availableFiscalStartYears = []
    for (var year = startFiscalYearStartYear; year <= endFiscalYearStartYear; year++) {
      let year1Str = year.toString()
      let year2Str = (year + 1).toString()
      state.availableFiscalStartYears.push({
        title: (
          year1Str.substr(year1Str.length - 2) + '/' +
          year2Str.substr(year2Str.length - 2)
        ),
        value: year
      })
    }
    console.log('setAvaialbleFiscalStartYears :: state.availableFiscalYears: ', state.availableFiscalYears)
  },

  setOAToken: (state, payload) => {
    console.log('system.js :: setOAToken: payload: ', payload)
    state.user.oa_token_type = payload.oaTokenType
    state.user.oa_access_token = payload.oaCccessToken
    state.user.oa_expires_in = payload.oaExpiresIn
  }
}

const actions = {
  async [types.CHECK_TOKEN] ({commit, getters, dispatch}, payload) {
    // let token = localStorage.getItem('token')
    if (getters.token) {
      if (typeof payload.callback === 'function') {
        payload.callback(true)
      }
    }

    let token = localStorage.getItem('accessToken')
    let result = false
    if (token) {
      await dispatch(types.SET_TOKEN, token).then(function () {
        dispatch('FETCH_USER_BY_TOKEN').then(function (response) {
          console.log('CHECK_TOKEN >> FETCH_USER_BY_TOKEN :; response: ', response)
          if (getters.user) {
            result = true
            if (typeof payload.callback === 'function') {
              payload.callback(result)
            }
          } else {
            if (typeof payload.callback === 'function') {
              payload.callback(result)
            }
          }
        }).catch(function (error) {
          console.log('error: ', error)
          payload.callback(result)
        })
      })
    } else {
      if (typeof payload.callback === 'function') {
        payload.callback(result)
      }
    }
  },

  [types.SET_LANG] ({commit}, payload) {
    commit('setLang', payload)
  },

  [types.SET_TOKEN] ({commit}, token) {
    commit('setToken', token)
    // if (!token) {
    //   Vue.axios.defaults.headers.common['Authorization'] = ''
    //   Vue.axios.defaults.headers.common['Content-Type'] = ''
    //   Vue.axios.defaults.headers.common['Accept'] = ''
    // }
  },

  async nuxtServerInit ({dispatch}, {req}) {
    await dispatch('fetch')
  },

  async updateOAAuth ({commit}, oaAuth) {
    commit('setOAAuth', oaAuth)
    if (process.browser) {
      if (oaAuth) {
        Cookies.set('oaAuth', oaAuth, {expires: 1})
      } else {
        Cookies.remove('oaAuth')
      }
    } else {
      let params = {
        domain: '/'
      }
      if (!oaAuth) {
        let expires
        let date = new Date()
        expires = date.setDate(date.getDate() + 1)
        params.expires = new Date(expires)
      }
    }
  },

  async [types.REMOVE_COOKIE_TOKEN] ({commit}) {
    commit('removeCookieToken')
  },

  // Update token
  async updateToken ({commit}, token) {
    commit('setToken', token)
    if (process.browser) {
      // ...Browser
      if (token) {
        console.log('updateToken before commit(setCookieToken) token: ', token)
        commit('setCookieToken', token)
      } else {
        alert('removecookieToken')
        commit('removeCookieToken')
      }
    } else {
      console.log('store commit(updateToken) :: without process.browser')
      // ...Server
      let params = {
        domain: '/'
      }
      if (!token) {
        let expires
        let date = new Date()
        expires = date.setDate(date.getDate() + 1)
        params.expires = new Date(expires)
      }
    }
    // Vue.axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
    // Vue.axios.defaults.headers.common['Content-Type'] = 'application/json'
    // Vue.axios.defaults.headers.common['Accept'] = 'application/json'
    // this.app.context.res.setHeader('Authorization', Cookie.serialize('ccmsToken', token, params))
    // console.log('Axios: ', this.$axios.defaults.headers.common.Authorization)
    console.log('store :: commit(updateToken) ends')
  },

  // Fetch Token
  async fetchToken ({getters, dispatch}) {
    console.log('store :: fetchToken')
    let token
    // Try to extract token from cookies
    if (!token) {
      token = getters.cookieToken
    }
    if (token) {
      await dispatch('updateToken', token)
    }
    if (process.browser) {
      console.log('store :: fetchtoken :: Browser token: ' + getters.token.substr(0, 10))
    } else {
      console.log('store :: fetchtoken :: Server token: ' + getters.token.substr(0, 10))
    }
  },

  // Reset
  async reset ({dispatch, commit}) {
    alert('reset')
    commit('setUser', null)
    await dispatch('updateToken', null)
    await dispatch('updateOAAuth', null)
  },

  [types.SET_DB_TEAM] ({rootGetters, getters, commit}, payload) {
    return new Promise((resolve, reject) => {
      // payload = team
      let team = payload
      let url = constants.apiUrl + '/users/' + getters.user.id
      let data = {
        oa_last_team_id: team.id
      }
      Vue.axios.put(url, data).then(function (response) {
        commit('setActiveTeam', payload)
        resolve(payload)
      }).catch(function (error) {
        reject(error)
      })
    })
  },

  async [types.SET_ACTIVE_TEAM] ({commit}, payload) {
    commit('setActiveTeam', payload)
  },

  async [types.FETCH_USER_BY_TOKEN] ({getters, state, commit, dispatch}, callback) {
    console.log('system.js :: FETCH_USER_BY_TOKEN')
    return new Promise((resolve, reject) => {
      // let token = getters.token
      let url = constants.apiUrl + '/user'
      let config = getters.apiHeaderConfig
      // Try to get user profile
      Vue.axios.get(url, config).then(function (response) {
        console.log('system.js FETCH_USER_BY_TOKEN: response: ', response.data)
        console.log('system.js FETCH_USER_BY_TOKEN ready to call SET_USER')

        dispatch(types.SET_USER, {
          user: response.data
        }).then(function (user) {
          dispatch('FETCH_OA_USER_EMPLOYEE').then(function (userEmployee) {
            console.log('FETCH_OA_USER_EMPLOYEE.then:: userEmployee: ', userEmployee)
            resolve(user)
          }).catch(function (error) {
            reject(error)
          })
        }).catch(function (error) {
          reject(error)
        })
        // return new Promise((resolve, reject) => {
        //   dispatch(types.SET_USER, {
        //     user: response.data
        //   }).then(function (response) {
        //     console.log('FETCH_USER_BY_TOKEN >> SET_USER :: response: ', response)
        //     resolve(response)
        //     // return new Promise((resolve, reject) => {
        //     //   dispatch('FETCH_OA_USER_EMPLOYEE').then(function (userEmployee) {
        //     //     console.log('FETCH_OA_USER_EMPLOYEE :: userEmployee: ', userEmployee)
        //     //     resolve(userEmployee)
        //     //   }).catch(function (error) {
        //     //     reject(error)
        //     //   })
        //     // })
        //   }).catch(function (error) {
        //     reject(error)
        //   })
        // })
      }, function (error) {
        reject(error)
      })
    })
  },

  [types.SET_USER] ({commit, state}, payload) {
    console.log('system.js SET_USER')
    return new Promise((resolve, reject) => {
      commit('setUser', payload)
      resolve({
        valid: true,
        isSupervisor: state.isSupervisor
      })
    })
  },

  async fetch ({getters, state, commit, dispatch}) {
    console.log('fetch')
    let url = constants.apiUrl + '/user'
    // Fetch and update latest token
    await dispatch('fetchToken')
    // Skip if there is no token set
    if (!state.token) {
      return
    }

    // Try to get user profile
    try {
      let config = getters.apiHeaderConfig
      await Vue.axios.get(url, config).then(function (response) {
        commit('setUser', response.data.user)
      })
    } catch (e) {
      // Reset store
      await dispatch('reset')
    }
  },

  // use token
  // async connectOA ({commit, dispatch, getters, state}, {token, callback}) {
  //   try {
  //     let url = constants.apiUrl + '/auth/connect_oa'
  //     let config = getters.apiHeaderConfig
  //
  //     await Vue.axios.post(url, data, config).then(function (response) {
  //       if (response.data.status) {
  //         console.log('connectOA :: post :: response.data.oaAuth: ', response.data.result)
  //         commit('setOAAuth', {...response.data.oaAuth, email: credentials.email})
  //         commit('setToken', response.data.token)
  //         dispatch('FETCH_USER_BY_TOKEN', callback)
  //       } else {
  //         commit('showModal', {
  //           title: app.$t('general.warning'),
  //           message: app.$t('messages.access_denied')
  //         }, {root: true})
  //       }
  //     }, function (error) {
  //       console.log('login :: error: ', error)
  //       // dispatch('login', {credentials, callback})
  //     })
  //   } catch (error) {
  //     if (error.response && error.response.status === 401) {
  //       throw new Error('Bad credentials')
  //     }
  //     throw error
  //   }
  // },

  // use email and password
  async loginOA ({commit, dispatch, getters, state}, {credentials, authorized, callback}) {
    try {
      let url = constants.apiUrl + '/auth/login_oa'
      let data = {
        authorized: authorized,
        email: credentials.email,
        password: credentials.password,
        teamId: null
      }
      let config = getters.apiHeaderConfig
      await Vue.axios.post(url, data, config).then(function (response) {
        // alert('loginOA :: token=' + response.data.access_token)

        if (response.data.status) {
          // status = true, supervisor or not

          // console.log('loginOA :: post :: response.data.oaAuth: ', response.data.result)
          // commit('setOAAuth', {...response.data.oaAuth, email: credentials.email})

          console.log('loginOA :: before commit(setCookieToken) : token : ', response.data.token)
          commit('setCookieToken', response.data.token)
          commit('setToken', response.data.token)
          dispatch('FETCH_USER_BY_TOKEN', callback)
        } else {
          commit('showModal', {
            title: app.$t('general.warning'),
            message: app.$t('messages.access_denied')
          }, {root: true})
        }
      }, function (error) {
        console.log('login :: error: ', error)
        // dispatch('login', {credentials, callback})
      })
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials')
      }
      throw error
    }
  },

  async login ({commit, dispatch, getters}, {credentials, callback}) {
    console.log('store :: login starts :: credentials: ', credentials)
    try {
      let url = constants.url + '/oauth/token'
      let data = {
        username: credentials.email,
        password: credentials.password,
        grant_type: 'password',
        client_id: constants.CLIENT_ID,
        client_secret: constants.CLIENT_SECRET
      }
      // Send credentials to API
      await Vue.axios.post(url, data).then(function (response) {
        // alert('login :: token=' + response.data.access_token)
        // let data = response.data
        let authorized = true
        // commit('setToken', data.access_token)
        // dispatch('updateToken', data.access_token)
        console.log('store :: login >> dispatch(FETCH_USER_BY_TOKEN)')
        dispatch('loginOA', {credentials, authorized, callback})

        // dispatch('FETCH_USER_BY_TOKEN', callback).then(function () {
        //   console.log('store :; login :: commit >> FETCH_USER_BY_TOKEN :: user:', getters.user)
        // })
      }, function (error) {
        console.log('login :: error: ', error)
        let authorized = false
        dispatch('loginOA', {credentials, authorized, callback})
        // commit('showModal', {title: 'Warning', message: error.response.data.message}, {root: true})
        // dispatch('loginOA', {credentials, callback})
        // console.log('store :: login :: /oauth/token error: ', error)
      })
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials')
      }
      throw error
    }
  },

  // async login0 ({ commit, dispatch, getters }, { credentials, callback }) {
  //   console.log('store :: login starts :: credentials: ', credentials)
  //   try {
  //     let url = constants.url + '/oauth/token'
  //     let data = {
  //       username: credentials.email,
  //       password: credentials.password,
  //       grant_type: 'password',
  //       client_id: constants.CLIENT_ID,
  //       client_secret: constants.CLIENT_SECRET
  //     }
  //     // Send credentials to API
  //     await Vue.axios.post(url, data).then(function (response) {
  //       console.log('store :: axios :: /oauth/token: response: ', response)
  //       let data = response.data
  //       console.log('store :: login >> commit(setToken)')
  //       commit('setToken', data.access_token)
  //       // dispatch('updateToken', data.access_token)
  //       console.log('store :: login >> dispatch(FETCH_USER_BY_TOKEN)')
  //       dispatch('FETCH_USER_BY_TOKEN', callback).then(function () {
  //         console.log('store :; login :: commit >> FETCH_USER_BY_TOKEN :: user:', getters.user)
  //       })
  //     }, function (error) {
  //       dispatch('loginOA', {credentials, callback})
  //       console.log('store :: login :: /oauth/token error: ', error)
  //     })
  //   } catch (error) {
  //     if (error.response && error.response.status === 401) {
  //       throw new Error('Bad credentials')
  //     }
  //     throw error
  //   }
  // },

  // Logout
  async logout ({dispatch, state}) {
    try {
      await dispatch('reset')
    } catch (e) {
      console.error('Error while logging out', e)
    }
  },

  async [types.GET_PUBLIC_FOLDERS] ({getters, commit}, payload) {
    let apiUrl = constants.apiUrl + '/folders'
    let config = {
      ...getters.apiHeaderConfig,
      params: {
        type: 'public'
      }
    }

    await Vue.axios.get(apiUrl, config).then(function (response) {
      commit('setPublicFolder', response.data)
    })
  },

  [types.MOVE_PRODUCT_CATEGORY] (context, payload) {
    console.log('system.js actions[types.MOVE_PRODUCT_CATEGORY]')
    // let beforeParent = payload.beforeParent
    let afterParent = payload.afterParent
    let dataItem = payload.dataItem
    let targetIndex = payload.targetIndex
    // let childrenAttr = payload.childrenAttr
    // let originalIndex = beforeParent[childrenAttr].indexOf(dataItem)
    let dragToNode = payload.dragToNode

    // remove original node
    let beforeCategory = getCategoryParent(dataItem.id)
    console.log('MOVE_PRODUCT_CATEGORY ::  found beforeCategory: ' + beforeCategory.name)
    let originalIndex = beforeCategory.children.indexOf(dataItem)
    console.log('MOVE_PRODUCT_CATEGORY ::  originalIndex = ' + originalIndex)

    console.log('MOVE_PRODUCT_CATEGORY :: before commit removeCategoryChild')
    context.commit('removeCategoryChild', {
      parentId: beforeCategory.id,
      itemId: dataItem.id
    })
    console.log('MOVE_PRODUCT_CATEGORY :: after commit removeCategoryChild')
    // beforeCategory.children.splice(originalIndex, 1)

    let afterCategory = getCategory(afterParent.id)

    console.log('MOVE_PRODUCT_CATEGORY :: afterCategory = ' + afterCategory.name)
    console.log('MOVE_PRODUCT_CATEGORY :: dragToNode: ' + dragToNode)
    if (dragToNode) {
      console.log('MOVE_PRODUCT_CATEGORY :: afterCategory.children: ', afterCategory.children)
      context.commit('appendCategoryChild', {
        parentId: afterCategory.id,
        item: dataItem
      })
      // afterParent.children.push(dataItem)
    } else {
      if (beforeCategory.id === afterCategory.id) {
        if (targetIndex > originalIndex) {
          context.commit('insertCategoryChild', {
            parentId: afterCategory.id,
            item: dataItem,
            index: targetIndex - 1
          })
          // afterCategory.children.splice(targetIndex, 0, dataItem)
        } else {
          context.commit('insertCategoryChild', {
            parentId: afterCategory.id,
            item: dataItem,
            index: targetIndex
          })
        }
      } else {
        context.commit('insertCategoryChild', {
          parentId: afterCategory.id,
          item: dataItem,
          index: targetIndex
        })
      }
    }
  },

  async [types.FETCH_TEAM_SETTINGS] ({rootGetters, state, commit}) {
    console.log('active team: ', state.activeTeam)
    // let url = constants.apiUrl + '/teams/' + state.activeTeamt/teams?include=currency'
    // let config = rootGetters.oaApiHeaderConfig
    // console.log('fetch teams: config: ', config)
    // await Vue.axios.get(url, config).then(response => {
    //   if (response.data.status) {
    //     console.log('FETCH_TEAMS :: response.data.result : ', response.data.result)
    //     commit('setTeams', response.data.result)
    //     console.log('fetch teams :: teams: ', response.data.result)
    //   }
    // })
  },

  async [types.FETCH_AVAILABLE_FISCAL_YEARS] ({rootGetters, getters, state, commit}, payload) {
    let vm = this
    let teamId = getters.teamId
    if (teamId) {
      let url = constants.oaApiUrl + '/admin/payrolls'
      let config = {
        params: {
          teamId: teamId
        }
      }
      if (payload['oaAuth']) {
        config['headers'] = vm.oaAuth2Headers(payload['oaAuth'])
      }
      await Vue.axios.get(url, config).then(response => {
        if (response.data.status) {
          let payrolls = response.data.result
          let startedDate = null
          let endedDate = null
          console.log('FETCH_AVAILABLE_FISCAL_YEARS  payrolls.length = ' + payrolls.length)
          for (var i = 0; i < payrolls.length; i++) {
            let payroll = payrolls[i]
            console.log('#' + i + ': start:' + payroll.startedDate + '    end:' + payroll.endedDate)
            if (startedDate === null || payroll.startedDate < startedDate) {
              startedDate = payroll.startedDate
            }
            if (endedDate === null || payroll.endedDate > endedDate) {
              endedDate = payroll.endedDate
            }
          }
          commit('setAvailableFiscalStartYears', {
            startedDate: startedDate,
            endedDate: endedDate
          })
        }
      })
    }
  },

  refreshOAToken ({rootGetters, commit}) {
    return new Promise((resolve, reject) => {
      console.log('refreshOAToken')
      let url = constants.apiUrl + '/oa_token'
      let config = rootGetters.apiHeaderConfig
      let data = {
        command: 'refresh'
      }
      Vue.axios.post(url, data, config).then(function (response) {
        if (response.data.status) {
          commit('setOAToken', response.data.result)
          resolve(response.data.result)
        } else {
          reject(response.data.result)
        }
      })
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
