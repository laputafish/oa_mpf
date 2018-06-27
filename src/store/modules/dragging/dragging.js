import * as types from './dragging_types'
import * as constants from '../../constants'
import axios from 'axios'

const state = {
  a: 0,
  // draggingItemVm: null,
  // draggingItemName: '',
  draggingItem: {
    name: '',
    fileType: '',
    fileItem: null
  }
}

const getters = {
  draggingVm: (state) => {
    return state.draggingItem.vm
  }
}
const mutations = {
  setDraggableItem: (state, payload) => {
    state.draggingItem.name = payload.name
    state.draggingItem.fileType = payload.fileType
    state.draggingItem.fileItem = payload.fileItem
  }
}

const actions = {
  async [types.SET_DRAGGABLE_ITEM] ({commit, state}, payload) {
    console.log('actions :: SET_DRAGGABLE_ITEM :: draggingItem: ', state.draggingItem)
    console.log('actions :: SET_DRAGGABLE_ITEM :: payload:', payload)
    commit('setDraggableItem', payload)
  },

  async [types.DROP_FILEITEM] ({commit, state}, payload) {
    let target = payload.target
    let apiUrl = constants.apiUrl + '/folders'
    console.log('DROP_FILEITEM :: source: name: ' + state.draggingItem.name)
    console.log('DROP_FILEITEM :: source: fileType: ' + state.draggingItem.fileType)
    console.log('DROP_FILEITEM :: source: fileItem: ', state.draggingItem.fileItem)
    console.log('DROP_FILEITEM :: target: ', target)
    let data = {
      targetFolderId: target.id,
      fileType: state.draggingItem.fileType,
      fileItemId: state.draggingItem.fileItem.id,
      command: 'DROP'
    }
    await axios.post(apiUrl, data)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
