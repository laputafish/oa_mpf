import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

// Modules
import auth from './modules/auth/auth'
import system from './modules/system/system'
import meetingRooms from './modules/meetingRooms/meetingRooms'
import meetingRoomBookings from './modules/meetingRoomBookings/meetingRoomBookings'
import meetings from './modules/meetings/meetings'
import equipments from './modules/equipments/equipments'
import fileManager from './modules/fileManager/fileManager'
import dragging from './modules/dragging/dragging'
import dialogs from './modules/dialogs/dialogs'
import employee from './modules/employee/employee'
// import employees from './modules/employees/employees'
import teams from './modules/teams/teams'
import groups from './modules/groups/groups'
import user from './modules/user/user'
import incomeParticulars from './modules/incomeParticulars/incomeParticulars'
import payTypes from './modules_oa/payTypes/payTypes'
import payrolls from './modules_oa/payrolls/payrolls'
import taxForms from './modules/taxForms/taxForms'
import employeeCommencements from './modules/taxForms/commencements/commencements'
import employeeDepartures from './modules/taxForms/departures/departures'
import employeeSalaries from './modules/taxForms/salaries/salaries'
import employeeTerminations from './modules/taxForms/terminations/terminations'
import irdForms from './modules/irdForms/irdForms'
import formRecord from './modules/irdForms/formRecord'
import sampleForms from './modules/sampleForms/sampleForms'

import Cookies from 'js-cookie'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'
const storePlugins = store => {
  store.oaAuth2Headers = function (oaAuth) {
    console.log('storePlugins :: oaAuth2Header: ', oaAuth)
    return {
      'Authorization': oaAuth.oaTokenType + ' ' + oaAuth.oaAccessToken,
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/plain, */*'
    }
  }
}

export const store = new Vuex.Store({
  modules: {
    auth,
    system,
    meetingRoomBookings,
    meetingRooms,
    meetings,
    equipments,
    fileManager,
    dragging,
    dialogs,
    employee,
    teams,
    groups,
    user,
    incomeParticulars,
    payTypes,
    payrolls,
    taxForms,
    employeeCommencements,
    employeeDepartures,
    employeeSalaries,
    employeeTerminations,
    irdForms,
    formRecord,
    sampleForms
  },
  plugins: [
    createPersistedState({
      storage: {
        getItem: key => Cookies.get(key),
        // Please see https://github.com/js-cookie/js-cookie#json, on how to handle JSON.
        setItem: (key, value) => Cookies.set(key, value, { expires: 3, secure: true }),
        removeItem: key => Cookies.remove(key)
      }
    }),
    storePlugins
  ],
  strict: debug
})
