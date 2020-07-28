import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import { EventBus } from '../event-bus'
/*
  routes
*/
import adminRoutes from './admin'
import authProviderRoutes from './auth-providers'
import regularUserRoutes from './regular-user'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    ...authProviderRoutes,
    ...regularUserRoutes,
    ...adminRoutes,
    {
      path: '*',
      redirect: {
        name: 'book-shareable-unit'
      }
    }
  ]
})

// Route Guard
const routeGuard = async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth) && !store.getters['login/userIsLoggedIn']) {
    if (store.getters['login/getLoginError'] === null) {
      store.commit('login/setRequestedRouteBeforeLoginMutation', to)
      await store.dispatch('login/reLogin')
    } else {
      store.commit('login/setRequestedRouteBeforeLoginMutation', to)
      next('/login')
    }
  } else {
    if (to.matched.some(record => record.meta.requiredRole)) {
      const roleNeeded = to.matched.map(i => i.meta.requiredRole).flat()

      const userRoles = [...store.getters['login/user'].roles]

      if (roleNeeded.some(rn => userRoles.indexOf(rn) !== -1)) {
        next()
      } else {
        EventBus.$emit('appMessage', {
          text: 'Sie sind nicht berechtigt, diese Funktion auszuführen!',
        })
      }
    } else {
      next()
    }
  }
}

router.beforeEach(routeGuard)

store.subscribe((mutation, state) => {
  if (mutation.type === 'login/SOCKET_SIGN_IN_SUCCESS' && state.login.loggedIn === true) {
    const lastRoute = state.login.requestedRouteBeforeLogin

    if (lastRoute && state.login.requestedRouteBeforeLogin.path !== 'login') {
      router.push(lastRoute.fullPath)
    } else {
      router.push({ name: 'book-shareable-unit' })
    }

    store.commit('login/setRequestedRouteBeforeLoginMutation', null)
  }

  if (mutation.type === 'login/SOCKET_RE_SIGN_IN_SUCCESS' && state.login.loggedIn === true) {
    const lastRoute = state.login.requestedRouteBeforeLogin

    if (lastRoute && state.login.requestedRouteBeforeLogin.path !== 'login') {
      router.push(lastRoute.fullPath)
    }

    store.commit('login/setRequestedRouteBeforeLoginMutation', null)
  }

  if (mutation.type === 'login/logoutMutation' || mutation.type === 'login/SOCKET_LOGOUT') {
    router.push('/login')
  }
})

export default router
