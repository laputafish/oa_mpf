// import * as types from './dialogs_types'
// import * as constants from '../../constants'
//
const state = {
  modalTitle: '',
  modalVisible: false,
  modalMessage: '',
  modalComponent: null
}

const getters = {
  modalTitle (state) {
    return state.modalTitle
  },
  modalVisible (state) {
    return state.modalVisible
  },
  modalMessage (state) {
    return state.modalMessage
  }
}

const mutations = {
  showModal (state, payload) {
    console.log('showModal :: payload:', payload)
    state.modalTitle = payload.title
    state.modalVisible = true
    state.modalMessage = payload.message
  },
  hideModal (state) {
    state.modalVisible = false
  }
}

const actions = {

}

export default {
  state,
  getters,
  mutations,
  actions
}
