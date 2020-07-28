import Vue from 'vue'
import Vuex from 'vuex'

import app from './app'
import shareableUnitBookings from './shareable-unit-bookings'
import shareableUnits from './shareable-units'
import buildings from './buildings'
import login from './login'
import rooms from './rooms'
import serverConfig from './server-config'
import systemConfig from './system-config'
import users from './users'
import utils from './utils'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    buildings,
    login,
    rooms,
    shareableUnitBookings,
    shareableUnits,
    serverConfig,
    systemConfig,
    users,
    utils,
  }
})

export default store
