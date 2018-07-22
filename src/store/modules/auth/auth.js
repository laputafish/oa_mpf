import Vue from 'vue'
import {app} from '@/main'
import * as constants from '../../constants'
import * as types from './auth_types'

const state = {
  token: localStorage.getItem('accessToken') || '',
  teamId: localStorage.getItem('teamId') || '',
  status: ''
}

const getters = {
  isAuthenticated: state => {
    // alert('state.token = ' + state.token)
    return !!state.token
  },
  authStatus: state => state.status
}

const mutations = {
  [types.AUTH_REQUEST]: (state) => {
    state.status = 'loading'
  },
  [types.AUTH_SUCCESS]: (state, token) => {
    state.status = 'success'
    state.token = token
  },
  [types.AUTH_ERROR]: (state) => {
    state.status = 'error'
  }
}

const actions = {
  [types.AUTH_REQUEST_OA]: ({commit, dispatch, state}, {credentials, authorized}) => {
    return new Promise((resolve, reject) => {
      let url = constants.apiUrl + '/auth/login_oa'
      let data = {
        authorized: authorized,
        email: credentials.email,
        password: credentials.password,
        teamId: state.teamId
      }
      let config = getters.apiHeaderConfig
      Vue.axios.post(url, data, config).then(response => {
        if (response.data.status) {
          const token = response.data.token
          localStorage.setItem('accessToken', token)
          commit('setToken', token)
          dispatch('FETCH_USER_BY_TOKEN').then(function (user) {
            console.log('AUTH_REQUEST_OA > FETCH_USER_BY_TOKEN > user: ', user)
            resolve(user)
          })
        } else {
          commit('showModal', {
            title: app.$t('general.warning'),
            message: app.$t('messages.access_denied')
          }, {root: true})
          resolve({
            'valid': false,
            'isSupervisor': false
          })
        }
      })
        .catch(error => {
          console.log('login :: error: ', error)
        })
    })
  },

  [types.AUTH_REQUEST]: ({commit, dispatch}, {credentials}) => {
    console.log('AUTH_REQUEST')
    return new Promise((resolve, reject) => { // The Promise used for router redirect in login
      commit(types.AUTH_REQUEST)
      let url = constants.url + '/oauth/token'
      let data = {
        username: credentials.email,
        password: credentials.password,
        grant_type: 'password',
        client_id: constants.CLIENT_ID,
        client_secret: constants.CLIENT_SECRET
      }
      Vue.axios.post(url, data).then(response => {
        let authorized = true
        dispatch(types.AUTH_REQUEST_OA, {credentials, authorized}).then(
          function (response) {
            console.log('AUTH_REQUEST > AUTH_REQUEST_OA')
            resolve(response)
          }
        )
      })
        .catch(() => {
          let authorized = false
          return dispatch(types.AUTH_REQUEST_OA, {credentials, authorized})
        })
    })
  },

  [types.AUTH_LOGOUT]: ({commit, dispatch}) => {
    return new Promise((resolve, reject) => {
      commit(types.AUTH_LOGOUT)
      localStorage.removeItem('accessToken') // clear your user's token from localstorage
      resolve()
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
