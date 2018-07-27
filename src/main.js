//
// vue-tree
// added:
// babel-plugin-syntax-jsx
// babel-plugin-transform-vue-jsx
// babel-helper-vue-jsx-merge-props

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import $ from 'jquery'
import Vue from 'vue'
import * as constants from '@/store/constants'

// import VueRouter from 'vue-router'

import VueMq from 'vue-mq'
import Vue2TouchEvents from 'vue2-touch-events'
import VeeValidate from 'vee-validate'
import 'vue-tree-halower/dist/halower-tree.min.css'
import {VTree} from 'vue-tree-halower'
// import LiquorTree from 'liquor-tree'

// import datePicker from 'vue-bootstrap-datetimepicker'
// import 'eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.css'
// import 'eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker-standalone.css'
import VModal from 'vue-js-modal'
import VueDraggable from 'vue-draggable'
import VuejsDialog from 'vuejs-dialog'
import Datatable from 'vue2-datatable-component'

import axios from 'axios'
import VueAxios from 'vue-axios'
import Moment from 'vue-moment'
import VueCookie from 'vue-cookie'
import VueCookies from 'vue-cookies'
import longpress from 'vue-long-press-directive'
import VueSlimScroll from 'vue-slimscroll'

// import customLocale from 'vue2-datatable-component/locale/custom'

// import VueDraggableTree from 'vue-draggable-tree'

// import VueDragTree from 'vue-drag-tree'
import SortableTree from 'vue-sortable-tree'

import { store } from './store/store'
import 'bootstrap'
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm'
// import {Carousel} from 'bootstrap-vue/es/components'
import App from './App'
// import Spinner from './Spinner'

// import router from './router'
import router from './router'
import VTooltip from 'v-tooltip'
// import jQuery from 'jquery'
//
import 'font-awesome/scss/font-awesome.scss'
import 'simple-line-icons/scss/simple-line-icons.scss'
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'

// window.jQuery = jQuery
// window.$ = jQuery
import {i18n} from '@/lang/lang.js'
import vSelect from 'vue-select'

window.$ = $
window.jQuery = $
Vue.use(VeeValidate)
Vue.use(VueMq, {
  breakpoints: {
    mobile: 450,
    tablet: 900,
    laptop: 1250,
    desktop: Infinity
  }
})
Vue.use(Vue2TouchEvents, {
  disableClick: true,
  touchClass: '',
  tapTolerance: 10,
  swipeTolerance: 30,
  longTapTimeInterval: 400
})
Vue.use(VModal, {dynamic: true})
Vue.use(VuejsDialog)
Vue.use(BootstrapVue)
Vue.use(Moment)
Vue.use(VueCookie)
Vue.use(VueCookies)

Vue.use(longpress, {duration: 1000})
Vue.use(VueSlimScroll)

// Vue.use(datePicker)
// Vue.directive('tooltip', VTooltip)
Vue.use(VTooltip)
// Vue.use(LiquorTree)
Vue.use(VueDraggable)
Vue.use(VueAxios, axios)
Vue.use(Datatable)
// Vue.use(Datatable, {customLocale})
Vue.use(VTree)
// Vue.use(VSelectTree)
// Vue.use(Carousel)
// Vue.component('vue-drag-tree', VueDragTree)
Vue.component(SortableTree.name, SortableTree)
Vue.config.productionTip = false
Vue.mixin({
  methods: {
    formatCurrency: (number) => number.toFixed(2)
  }
})
Vue.use(vSelect)

Vue.axios.interceptors.request.use(function (config) {
  console.log('axios :: interceptors :: url = ' + config.url + ' headers: ', config.headers)
  // alert(JSON.stringify(config))
  // console.log('axios.interceptors: config: ', JSON.stringify(config))
  // console.log('axios :: store.getters.apiHeaderConfig: ',
  //   store.getters.apiHeaderConfig)
  // console.log('axios :: constants: ', constants)
  // console.log('axios :: config.url = ' + config.url)

  let promiseConfig = null
  if (config.url.indexOf(constants.apiUrl) === 0) {
    console.log('axios :: is app api')
    // using app api
    if (config.url.indexOf('oa_token') >= 0) {
      console.log('axios :: store.getters: ', store.getters)
    }
    config.headers = store.getters.apiHeaderConfig.headers
    // console.log('axios :: using apiUrl')
    promiseConfig = Promise.resolve(config)
  } else if (config.url.indexOf(constants.oaApiUrl) === 0) {
    console.log('axios :: is oa api')
    // using oa api

    // Check if oaAuth header applied
    if (config.headers['Authorization']) {
      promiseConfig = Promise.resolve(config)
    } else {
      promiseConfig = new Promise((resolve, reject) => {
        console.log('axios (url=' + config.url + ') : ready to refreshOAToken')
        store.dispatch('refreshOAToken').then(function (response) {
          console.log('axios :: refreshOAToken : response: ', response)

          let headerConfig = {
            'Authorization': response.oaTokenType + ' ' + response.oaAccessToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/plain, */*'
          }
          // .getters.oaApiHeaderConfig
          // if (headerConfig === null) {
          //   console.log('axios (oa): url = ' + config.url + ': headerConfig is null')
          //   reject(config)
          // } else {
          console.log('axios (oa): url = ' + config.url + ': headerConfig ok')
          config.headers = headerConfig
          console.log('axios :: config.headers: ', config.headers)
          resolve(config)
          // }
        }, function (error) {
          alert('refreshOAToken error')
          console.log('axios :: error: ', error)
          reject(error)
        })
      })
    }
    // if (config.url.indexOf('employees') >= 0) {
    //   promiseConfig = store.dispatch('refreshOAToken').then(function () {
    //     config.headers = store.getters.oaApiHeaderConfig.headers
    //     promiseConfig = Promise.resolve(config)
    //     Promise.resolve(config)
    //   })
    // } else {
    //   let headerConfig = store.getters.oaApiHeaderConfig
    //   if (headerConfig === null) {
    //     promiseConfig = Promise.reject(config)
    //   } else {
    //     config.headers = headerConfig.headers
    //     promiseConfig = Promise.resolve(config)
    //   }
    // }
    // console.log('axios :: using oaApiUrl')
  }
  return promiseConfig
})

Vue.filter('formatSize', function (size) {
  if (size > 1024 * 1024 * 1024 * 1024) {
    return (size / 1024 / 1024 / 1024 / 1024).toFixed(2) + ' TB'
  } else if (size > 1024 * 1024 * 1024) {
    return (size / 1024 / 1024 / 1024).toFixed(2) + ' GB'
  } else if (size > 1024 * 1024) {
    return (size / 1024 / 1024).toFixed(2) + ' MB'
  } else if (size > 1024) {
    return (size / 1024).toFixed(2) + ' KB'
  }
  return size.toString() + ' B'
})

// Object.defineProperty(Vue.prototype, '$formatter', new Intl.NumberFormat('en-US', {
//   style: 'currency',
//   currency: 'USD',
//   minimumFractionDigits: 2
// }))

/* eslint-disable no-new */
// router.beforeEnter = (to, from, next) => {
//   alert('beforeEnter')
//   if (to.name !== 'general.login') {
//     console.log('beforeEnter this: ', this.app)
//   } else {
//     next()
//   }
// }

// Vue.use(VueRouter)
//
// let router = new VueRouter({
//   mode: 'history',
//   linkActiveClass: 'open active',
//   beforeEach: (to, from, next) => {
//     alert('beforeach')
//   },
//   scrollBehavior: () => ({y: 0}),
//   routes: [{
//     beforeEnter: (to, from, next) => {
//       if (to.name !== 'general.login') {
//         console.log('beforeEnter this.app: ', this.app)
//         next()
//       } else {
//         next()
//       }
//     },
//     ...routes
//   }]
// })

// let checkToken = () => {
//   let token = getCookieToken()
//   alert('token = ' + token)
//   return true
// }

// export const spinner = new Vue({
//   el: '#spinner',
//   components: {
//     Spinner
//   },
//   mounted () {
//     alert('x')
//   }
// })

Vue.mixin({
  methods: {
    i18nForDatatable: (srcTxt) => {
      this.t('database.' + srcTxt)
    }
  }
})

const myMixin = {
  methods: {
    getCurrentFiscalYear () {
      return 2017
    }
  }
}
export const app = new Vue({
  el: '#app',
  router,
  store,
  i18n,
  mixins: [myMixin],
  template: '<App/>',
  mounted () {
    // after current component is mounted
    //
    // i.e.
    // Fue.vue is mounted before
    //
  },
  beforeCreate: function () {
    console.log('main.js beforeCreate')
  },
  // created: function () {
  //   let token = getCookieToken()
  //   console.log('main.js created :: token = ' + token)
  // },
  components: {
    App
  }
  // ,
  // methods: {
  //   checkToken: function () {
  //     alert('checkToken')
  //     return true
  //   }
  // }
})

console.log('main.js :: app: ', app)
window['vue'] = app
window.store = store
