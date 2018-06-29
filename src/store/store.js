import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

// Modules
import system from './modules/system/system'
import meetingRooms from './modules/meetingRooms/meetingRooms'
import meetingRoomBookings from './modules/meetingRoomBookings/meetingRoomBookings'
import meetings from './modules/meetings/meetings'
import equipments from './modules/equipments/equipments'
import fileManager from './modules/fileManager/fileManager'
import dragging from './modules/dragging/dragging'
import dialogs from './modules/dialogs/dialogs'
import employees from './modules/employees/employees'
import teams from './modules/teams/teams'
import groups from './modules/groups/groups'
import user from './modules/user/user'

import Cookies from 'js-cookie'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

export const store = new Vuex.Store({
  modules: {
    system,
    meetingRoomBookings,
    meetingRooms,
    meetings,
    equipments,
    fileManager,
    dragging,
    dialogs,
    employees,
    teams,
    groups,
    user
  },
  plugins: [
    createPersistedState({
      storage: {
        getItem: key => Cookies.get(key),
        // Please see https://github.com/js-cookie/js-cookie#json, on how to handle JSON.
        setItem: (key, value) => Cookies.set(key, value, { expires: 3, secure: true }),
        removeItem: key => Cookies.remove(key)
      }
    })
  ],
  strict: debug
})
