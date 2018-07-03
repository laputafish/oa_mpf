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

// import customLocale from 'vue2-datatable-component/locale/custom'

// import VueDraggableTree from 'vue-draggable-tree'

// import VueDragTree from 'vue-drag-tree'
import SortableTree from 'vue-sortable-tree'

import { store } from './store/store'
import 'bootstrap'
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm'
// import {Carousel} from 'bootstrap-vue/es/components'
import App from './App'
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
  disableClick: false,
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

export const app = new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  mounted () {
    // after current component is mounted
    //
    // i.e.
    // Fue.vue is mounted before
    //
    console.log('Vue.$cookie: ', Vue.$cookie)
    console.log('Vue.$cookies: ', Vue.$cookies)
    console.log('Vue: ', Vue)
    console.log('this: ', this)
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
