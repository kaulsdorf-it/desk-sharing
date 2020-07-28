import Vue from 'vue'
import vuetify from './plugins/vuetify'

import App from './app'
import router from './router/'
import moment from 'moment'
import VueMomentJS from 'vue-momentjs'
import store from './store/'

import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@mdi/font/css/materialdesignicons.css'
import './assets/main.css'
import './assets/scss/index.scss'

import registerFilters from './filter'
import checkAccessRightsMixin from './mixins'

import { EventBus } from './event-bus'

import { registerGeneralComponents } from './components/general'
import { initializeWebSocketConnection } from './plugins/socket-io'
import { installFormValidators } from './plugins/validators'
import { installVueDraggable } from './plugins/vue-draggable'
import { installVueDragDrop } from './plugins/vue-drag-drop'

import installArrayFunctions from './functions/array-functions'

installArrayFunctions()

installVueDragDrop()

Vue.use(VueMomentJS, moment)
Vue.use(registerFilters)
registerGeneralComponents(Vue)
checkAccessRightsMixin()
installFormValidators()
installVueDraggable()
initializeWebSocketConnection()

EventBus.$emit('started')

localStorage.debug = '*#'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
