// import {app} from '@/main'
import Vue from 'vue'
import VueRouter from 'vue-router'
import { store } from '@/store/store'

// import Cookie from 'cookie'
// import Cookies from 'js-cookie'

// Containers
import Full from '@/containers/Full'

// Views
// import Dashboard from '@/views/Dashboard'
import OADashboard from '@/views/oa/dashboard/Dashboard'
import OAProfile from '@/views/oa/profile/Profile'
// import Charts from '@/views/Charts'
import Widgets from '@/views/Widgets'

// View: /Auth
// import Login from '@/pages/login'
// import Register from '@/pages/register'

// View: /bootstrapcdn
import Alerts from '@/views/bootstrap/Alerts'
// import Alerts from '@/views/bootstrap/Alerts'
import Badge from '@/views/bootstrap/Badge'
import Breadcrumb from '@/views/bootstrap/Breadcrumb'
import BootstrapButtons from '@/views/bootstrap/Buttons'
import BootstrapButtonGroup from '@/views/bootstrap/ButtonGroup'
import BootstrapButtonToolbar from '@/views/bootstrap/ButtonToolbar'
import Carousel from '@/views/bootstrap/Carousel'
import Collapse from '@/views/bootstrap/Collapse'
import Dropdown from '@/views/bootstrap/Dropdown'
import BootstrapForms from '@/views/bootstrap/Forms'
import InputGroup from '@/views/bootstrap/InputGroup'
import Jumbotron from '@/views/bootstrap/Jumbotron'
import ListGroup from '@/views/bootstrap/ListGroup'
import Modal from '@/views/bootstrap/Modal'

// Application Modules
import AppContainer from '@/containers/AppContainer'
import ProductList from '@/views/products/ProductList'
import AttributeList from '@/views/attributes/AttributeList'
import BundleList from '@/views/bundles/BundleList'
import MenuSectionList from '@/views/menuSections/MenuSectionList'

import VToolTip from '@/views/vueplugins/VToolTip'

// OA - Meetings
import MeetingRoomBookingList from '@/views/oa/meetingRoomBookings/MeetingRoomBookingList'
import MeetingList from '@/views/oa/meetings/MeetingList'
import MeetingRoomList from '@/views/oa/meetingRooms/MeetingRoomList'
import FileManager from '@/views/oa/fileManager/FileManager'

// View: /Components
import Buttons from '@/views/components/Buttons'
import SocialButtons from '@/views/components/SocialButtons'
import Cards from '@/views/components/Cards'
import Forms from '@/views/components/Forms'
import Modals from '@/views/components/Modals'
import Switches from '@/views/components/Switches'
import Tables from '@/views/components/Tables'

// Views - Custom
// Views - DragDropTree
import DragDropTree from '@/views/custom/DragDropTree'
import DraggableTree from '@/views/custom/DraggableTree'
import VueDragTree from '@/views/custom/VueDragTree'
import SortableTree from '@/views/custom/SortableTree'
import VueDraggable from '@/views/custom/VueDraggable'
import Vue2DataTable from '@/views/custom/Vue2DataTable'

// Views - Icons
import FontAwesome from '@/views/icons/FontAwesome'
import SimpleLineIcons from '@/views/icons/SimpleLineIcons'

// Views - pages
import Page404 from '@/views/pages/Page404'
import Page500 from '@/views/pages/Page500'
import Login from '@/views/pages/Login'
import Register from '@/views/pages/Register'

// Main Panel
// import ProductMenu from '@/views/MainPanel/ProductMenu'

// Views - header Pages
import HeaderPage1 from '@/views/headerPages/HeaderPage1'
import HeaderPage2 from '@/views/headerPages/HeaderPage2'
import HeaderPage3 from '@/views/headerPages/HeaderPage3'

// OA
import MpfManagement from '@/views/oa/mpfManagement/MpfManagement'
// import TaxForms from '@/views/oa/taxForms/TaxForms'
import TeamSelection from '@/views/oa/teamSelection/TeamSelection'
import EmployeeCommencement from '@/views/oa/irdForms/employeeCommencement/EmployeeCommencement'
import EmployeeTermination from '@/views/oa/irdForms/employeeTermination/EmployeeTermination'
import EmployeeDeparture from '@/views/oa/irdForms/employeeDeparture/EmployeeDeparture'
import EmployeeSalary from '@/views/oa/irdForms/employeeSalary/EmployeeSalary'
import IrdForms from '@/views/oa/irdForms/IrdForms'
import ApplyForIrdApproval from '@/views/oa/applyForIrdApproval/ApplyForIrdApproval'

import IrdFormSetup from '@/views/oa/irdFormSetup/IrdFormSetup'
import MyIrdForms from '@/views/oa/myIrdForms/MyIrdForms'

// Supervisor Modules
import SuperDashboard from '@/views/oaAdmin/superDashboard/SuperDashboard'
import IrdFormManager from '@/views/oaAdmin/irdFormManager/IrdFormManager'
import TeamManager from '@/views/oaAdmin/teamManager/TeamManager'

// import jQuery from 'jquery'
// window.jQuery = jQuery
// window.$ = jQuery

Vue.use(VueRouter)

// let getCookieToken = () => {
//   const cookieStr = process.browser ? document.cookie : this.app.context.req.headers.cookie
//   const cookies = Cookie.parse(cookieStr || '') || {}
//   return cookies['ccmsToken']
// }

// let checkToken = () => {
//   let token = getCookieToken()
//   alert('token = ' + token)
//   return true
// }
//

const adminModules = [
  '/ird_forms', '/ird_forms/setup'
]

// const checkRole = (roles, targetRole) => {
//   let result = false
//   for (var i = 0; i < roles.length; i++) {
//     if (roles[i].name === targetRole) {
//       result = true
//       break
//     }
//   }
//   return result
// }

const ifAuthenticated = (to, from, next) => {
  if (store.getters.languageOptions.length === 0) {
    store.dispatch('FETCH_LANGUAGES')
  }

  if (store.getters.user) {
    console.log('ifAuthenticated :: user is defined.')
    if (store.getters.isAuthenticated) {
      console.log('ifAuthenticated :: is Authenicated')
      if (adminModules.indexOf(to.path) >= 0) {
        console.log('ifAuthenticated :: modules requires checking')
        let isPayrollAdmin = store.getters.isPayrollAdmin
        let isOwner = store.getters.isOwner
        if (isPayrollAdmin || isOwner) {
          next()
        } else {
          next('/login')
        }
        // let roles = store.getters.roles
        // if (checkRole(roles, 'Payroll Management')) {
        //   next()
        // } else {
        //   next('/my_ird_forms')
        // }
      } else {
        next()
      }
    }
  } else {
    console.log('ifAuthenticated :: user is undefined')
    store.dispatch('CHECK_TOKEN', {
      callback: function (status) {
        let isSupervisor = store.getters.isSupervisor
        console.log('CHECK_TOKEN :: callback :: status = ' + (status ? 'yes' : ' no') + ', isSupervisor: ' + (isSupervisor ? 'yes' : 'no'))
        if (status) {
          if (isSupervisor) {
            next()
          } else {
            store.dispatch('FETCH_OA_USER_EMPLOYEE', 'x').then(function (oaEmployee) {
              if (adminModules.indexOf(to.path) >= 0) {
                let roles = store.getters.roles
                console.log('router/index.js/roles: ', roles)
                let isPayrollAdmin = store.getters.isPayrollAdmin
                let isOwner = store.getters.isOwner
                if (isPayrollAdmin || isOwner) {
                  next()
                } else {
                  next('/login')
                }

                // if (checkRole(roles, 'Payroll Management')) {
                //   next()
                // } else {
                //   console.log('ifAuthenticated :; next(my_ird_forms)')
                //   next('/my_ird_forms')
                // }

                // store.dispatch('FETCH_OA_PERMISSIONS').then((roles) => {
                //   console.log('FETCH OA PERMISSIONS: roles: ', roles)
                //   if (checkRole(roles, 'Payroll Management')) {
                //     next()
                //   } else {
                //     next('/my_ird_forms')
                //   }
                // })
              } else {
                next()
              }
            })
          }
        } else {
          next('/login')
        }
      }
    })
    // next('/login')
  }
  // if (false && store.getters.isAuthenticated) {
  //   store.dispatch('CHECK_TOKEN', {
  //     callback: function (status) {
  //       if (status) {
  //         if (adminModules.indexOf(to.path) >= 0) {
  //           let roles = store.getters.roles
  //           console.log('router/index.js/roles: ', roles)
  //           if (checkRole(roles, 'Payroll Management')) {
  //             next()
  //           } else {
  //             next('/my_ird_forms')
  //           }
  //           // store.dispatch('FETCH_OA_PERMISSIONS').then((roles) => {
  //           //   console.log('FETCH OA PERMISSIONS: roles: ', roles)
  //           //   if (checkRole(roles, 'Payroll Management')) {
  //           //     next()
  //           //   } else {
  //           //     next('/my_ird_forms')
  //           //   }
  //           // })
  //         }
  //       } else {
  //         next('/login')
  //       }
  //     }
  //   })
  //   //
  //   // alert('isAuthenticated is true')
  //   // next()
  //   // return
  // } else {
  //   next('/login')
  // }
}

// const withPrefix = (prefix, routes) =>
//   routes.map((route) => {
//     route.path = prefix + route.path
//     return route
//   })

export default new VueRouter({
  mode: 'history',
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      redirect: '/ird_forms',
      // beforeEnter: (to, from, next) => {
      //   alert('beforeEach')
      //   console.log('app: ', app)
      // },
      name: 'general.home',
      component: Full,
      beforeEnter: ifAuthenticated,
      // beforeEnter: (from, to, next) => {
      //   if (checkToken()) {
      //     next()
      //   } else {
      //     next(false)
      //   }
      // },
      children: [
        // *******************
        // Supervisor
        // *******************
        {
          path: '/super_dashboard',
          name: 'super.super_dashboard',
          component: SuperDashboard
        },
        {
          path: '/ird_form_manager',
          name: 'tax.tax_form_manager',
          component: IrdFormManager
        },
        {
          path: '/team_manager',
          name: 'team.team_manager',
          component: TeamManager
        },
        {
          path: '/ird_form_setup',
          name: 'tax.ird_form_setup',
          component: IrdFormSetup
        },
        // ********************
        // General User
        // ********************
        {
          path: 'profile',
          name: 'general.profile',
          component: OAProfile
        },
        {
          path: 'dashboard',
          name: 'general.dashboard',
          component: OADashboard
        },
        {
          path: 'mpf_management',
          name: 'mpf.mpf_management',
          component: MpfManagement
        },
        {
          path: 'ird_forms',
          name: 'tax.ird_forms_management',
          component: IrdForms,
          children: [
            {
              path: 'setupx',
              name: 'tax.setup'
            }
          ]
        },
        {
          path: 'apply_for_approval',
          name: 'tax.apply_for_computerized_form_approval',
          component: ApplyForIrdApproval
        },
        {
          path: 'my_ird_forms',
          name: 'tax.salary_tax_records',
          component: MyIrdForms
          // ,
          // beforeEnter: ifAuthenticated
        },
        {
          path: 'employee_commencement',
          name: 'tax.employee_commencement',
          component: EmployeeCommencement
        },
        {
          path: 'employee_termination',
          name: 'tax.employee_termination',
          component: EmployeeTermination
        },
        {
          path: 'employee_departure',
          name: 'tax.employee_departure_from_hk',
          component: EmployeeDeparture
        },
        {
          path: 'employee_salary',
          name: 'tax.employee_salary',
          component: EmployeeSalary
        },
        // {
        //   path: 'tax_forms',
        //   name: 'tax.tax_forms',
        //   component: TaxForms,
        //   beforeEnter: ifAuthenticated
        // },
        {
          path: '/app',
          redirect: '/app/products',
          name: 'Products',
          component: AppContainer,
          children: [
            {
              path: 'meeting_rooms',
              name: 'Meeting Rooms',
              component: MeetingRoomList
            },
            {
              path: 'meeting_room_bookings',
              name: 'Meeting Room Bookings',
              component: MeetingRoomBookingList
            },
            {
              path: 'meetings',
              name: 'Meetings',
              component: MeetingList
            },
            {
              path: 'products',
              name: '食品列表',
              component: ProductList
            },
            {
              path: 'attributes',
              name: '選項列表',
              component: AttributeList
            },
            {
              path: 'bundles',
              name: '套餐列表',
              component: BundleList
            },
            {
              path: 'menu_sections',
              name: '菜品分類列表',
              component: MenuSectionList
            }
          ]
        },

        {
          path: 'folders/:folderId?/:folderName?',
          name: 'file.file_manager',
          component: FileManager
        },
        // {
        //   path: 'charts',
        //   name: 'Charts',
        //   component: Charts
        // },
        {
          path: 'widgets',
          name: 'Widgets',
          component: Widgets
        },
        {
          path: 'auth',
          name: 'Auth',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            // {
            //   path: 'login',
            //   name: 'BootstrapLogin',
            //   component: Login
            // },
            {
              path: 'register',
              name: 'BootstrapRegister',
              component: Register
            }
          ]
        },
        {
          path: 'pages/header_page1',
          name: 'HeaderPage1',
          component: HeaderPage1
        },
        {
          path: 'pages/header_page2',
          name: 'HeaderPage2',
          component: HeaderPage2
        },
        {
          path: 'pages/header_page3',
          name: 'HeaderPage3',
          component: HeaderPage3
        },
        {
          path: 'custom',
          redirect: '/custom/draggable_tree',
          name: 'Custom',
          component: {
            render (c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'dragdrop_tree',
              name: 'Tree',
              component: DragDropTree
            },
            {
              path: 'draggable_tree',
              name: 'Draggable Tree',
              component: DraggableTree
            },
            {
              path: 'vue_drag_tree',
              name: 'Vue Drag Tree',
              component: VueDragTree
            },
            {
              path: 'sortable_tree',
              name: 'Sortable Tree',
              component: SortableTree
            },
            {
              path: 'vue_draggable',
              name: 'VueDraggable',
              component: VueDraggable
            },
            {
              path: 'vue2_datatable',
              name: 'Vue2DataTable',
              component: Vue2DataTable
            }
          ]
        },
        {
          path: 'bootstrap',
          redirect: '/bootstrap/alerts',
          name: 'Bootstrap',
          component: {
            render (c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'alerts',
              name: 'Alerts',
              component: Alerts
            },
            {
              path: 'badge',
              name: 'Badges',
              component: Badge
            },
            {
              path: 'breadcrumb',
              name: 'Breadcrumb',
              component: Breadcrumb
            },
            {
              path: 'buttons',
              name: 'BootstrapButtons',
              component: BootstrapButtons
            },
            {
              path: 'button_group',
              name: 'Button Group',
              component: BootstrapButtonGroup
            },
            {
              path: 'button_toolbar',
              name: 'Button Toolbar',
              component: BootstrapButtonToolbar
            },
            {
              path: 'carousel',
              name: 'Carousel',
              component: Carousel
            },
            {
              path: 'collapse',
              name: 'Collapse',
              component: Collapse
            },
            {
              path: 'dropdown',
              name: 'Dropdown',
              component: Dropdown
            },
            {
              path: 'forms',
              name: 'BootstrapForms',
              component: BootstrapForms
            },
            {
              path: 'inputgroup',
              name: 'InputGroup',
              component: InputGroup
            },
            {
              path: 'jumbotron',
              name: 'Jumbotron',
              component: Jumbotron
            },
            {
              path: 'listgroup',
              name: 'ListGroup',
              component: ListGroup
            },
            {
              path: 'modal',
              name: 'Modal',
              component: Modal
            }
          ]
        },

        {
          path: 'vueplugins',
          redirect: '/vueplugins/vtooltip',
          name: 'VuePlugins',
          component: {
            render (c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'vtooltip',
              name: 'VToolTip',
              component: VToolTip
            }
          ]
        },
        {
          path: 'components',
          redirect: '/components/buttons',
          name: 'Components',
          component: {
            render (c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'buttons',
              name: 'Buttons',
              component: Buttons
            },
            {
              path: 'social-buttons',
              name: 'Social Buttons',
              component: SocialButtons
            },
            {
              path: 'cards',
              name: 'Cards',
              component: Cards
            },
            {
              path: 'forms',
              name: 'Forms',
              component: Forms
            },
            {
              path: 'modals',
              name: 'Modals',
              component: Modals
            },
            {
              path: 'switches',
              name: 'Switches',
              component: Switches
            },
            {
              path: 'tables',
              name: 'Tables',
              component: Tables
            }
          ]
        },
        {
          path: 'icons',
          redirect: '/icons/font-awesome',
          name: 'Icons',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'font-awesome',
              name: 'Font Awesome',
              component: FontAwesome
            },
            {
              path: 'simple-line-icons',
              name: 'Simple Line Icons',
              component: SimpleLineIcons
            }
          ]
        }
      ]
    },
    {
      path: '/main_panel',
      redirect: '/main_panel/product_menu',
      name: 'Main Panel',
      component: {
        render (c) { return c('router-view') }
      }
      // ,
      // children: [
      //   {
      //     path: 'product_menu',
      //     name: 'Menu',
      //     component: ProductMenu
      //   }
      // ]
    },
    {
      path: '/team_selection',
      name: 'team.team_selection',
      component: TeamSelection
    },
    {
      path: '/login',
      name: 'Login',
      beforeEnter: function (to, from, next) {
        console.log('Logon beforeEnter')
        next()
      },
      component: Login
    },
    {
      path: '/pages',
      redirect: '/pages/p404',
      name: 'Pages',
      component: {
        render (c) { return c('router-view') }
      },
      children: [
        {
          path: '404',
          name: 'Page404',
          component: Page404
        },
        {
          path: '500',
          name: 'Page500',
          component: Page500
        },
        // {
        //   path: 'login',
        //   name: 'PagesLogin',
        //   component: Login
        // },
        {
          path: 'register',
          name: 'Register',
          component: Register
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
