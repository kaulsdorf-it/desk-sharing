import Vue from 'vue'
import { socket } from '../plugins/socket-io'
import store from './index'
import { EventBus } from '../event-bus'

const state = {
  items: [],
  status: [],
  roles: [],
  usersHaveBeenLoaded: false,
  confirmUserAccountStateRunning: null,
  confirmUserAccountError: null,
  confirmedAccount: null,
}

// actions
const confirmUserAccountAction = (context, userId) => {
  context.commit('startConformUserAccountMutation')
  setTimeout(() => socket.send('confirm-user-account', userId), 1000)
}

const loadAction = context => {
  context.commit('loadingMutation', false)
  socket.send('get-users')
}

const loadUserStatusAction = () => {
  socket.send('get-user-status')
}

const loadUserRolesAction = () => {
  socket.send('get-user-roles')
}

const registerNewUserAction = (context, user) => {
  socket.send('sign-up-user', user)
}

const updateUserReferenceDataAction = (context, userProfile) => {
  socket.send('update-user-reference-data', userProfile)
}

const updateAction = (context, user) => {
  socket.send('update-user', user)
}

const activateLocalUserAction = (context, user) => {
  socket.send('activate-local-user', user)
}

const actions = {
  activateLocalUserAction,
  confirmUserAccountAction,
  loadAction,
  loadUserStatusAction,
  loadUserRolesAction,
  updateUserReferenceDataAction,
  updateAction,
  registerNewUserAction,
}

// mutations
const loadingMutation = (state, loading) => {
  state.usersHaveBeenLoaded = loading
  state.usersHaveBeenLoaded = true
}

const startConformUserAccountMutation = state => {
  state.confirmUserAccountStateRunning = true
}

const SOCKET_GET_USERS_SUCCESS = (state, response) => {
  state.items = response[0]
}

const SOCKET_GET_USER_STATUS_SUCCESS = (state, response) => {
  state.status = response[0]
}

const SOCKET_GET_USER_ROLES_SUCCESS = (state, response) => {
  state.roles = response[0]
}

const SOCKET_UPDATE_USER_SUCCESS = (state, response) => {
  const user = response[0]
  const idx = state.items.findIndex(i => i._id === user._id)

  if (idx !== -1) {
    Vue.set(state.items, idx, user)
  } else {
    state.items.push(user)
  }

  const currentUserId = store.getters['login/user']._id

  if (user._id === currentUserId) {
    store.commit('login/updateUserMutation', user)
  }
}

const SOCKET_SIGN_UP_USER_SUCCESS = (state, response) => {
  let text

  if (response[0].status === 'active') {
    text = 'Ihr Benutzerkonto wurde erstellt! Sie sind Administrator dieses Servers. Sie können sich ab sofort anmelden.'
  } else if (response[0].status === 'unconfirmed') {
    text = 'Wir haben Ihnen eine E-Mail mit dem Link zur Bestätigung gesandt. Bitte klicken Sie diesen Link an!'
  }

  if (text) {
    EventBus.$emit('appMessage', {
      color: 'success',
      timeout: 10000,
      text
    })
  }
}

const SOCKET_CONFIRM_USER_ACCOUNT_SUCCESS = (state, response) => {
  state.confirmedAccount = response[0]
  state.confirmUserAccountStateRunning = false
}

const SOCKET_CONFIRM_USER_ACCOUNT_FAILED = (state, response) => {
  state.confirmUserAccountError = response[0]
  state.confirmUserAccountStateRunning = false
}

const mutations = {
  loadingMutation,
  startConformUserAccountMutation,
  SOCKET_CONFIRM_USER_ACCOUNT_FAILED,
  SOCKET_CONFIRM_USER_ACCOUNT_SUCCESS,
  SOCKET_GET_USERS_SUCCESS,
  SOCKET_GET_USER_STATUS_SUCCESS,
  SOCKET_GET_USER_ROLES_SUCCESS,
  SOCKET_UPDATE_USER_SUCCESS,
  SOCKET_SIGN_UP_USER_SUCCESS,
}

// getters
const getUserName = (state, a, b, rootState) => userId => {
  const user = getById(state, a, b, rootState)(userId)
  if (user) {
    return `${user.firstName} ${user.lastName}`
  }
}

const getUserReferenceDataValueByTarget = (state, a, b, rootGetters) => target => {
  const userRefData = rootGetters['login/user'].userReferenceData

  if (!userRefData || !userRefData.data) {
    return null
  }

  const parts = target.split('.')
  // get rid of first part ("form")
  parts.shift()

  let value = userRefData.data
  parts.forEach(part => {
    value = value[part]
  })

  return value
}

const getUsersWithAuthProvider = (state, a, b, rootGetters) => {
  const authProviders = rootGetters['serverConfig/getAuthProviders']
  const getAuthProvider = user => {
    const authProvider = authProviders.find(i => i._id === user.authProviderId)
    return { ...authProvider, nameAndType: `${authProvider.provider.name} (${authProvider.type})` }
  }

  return state.items.map(user => ({
    ...user,
    authProvider: getAuthProvider(user)
  }))
}

const getById = (state, a, b, rootGetters) => userId => {
  const user = state.items.find(i => i._id === userId)

  if (!user) {
    return null
  }
  const authProviders = rootGetters['serverConfig/getAuthProviders']
  const authProvider = authProviders.find(i => i._id === user.authProviderId)
  return {
    ...user,
    authProvider: {
      ...authProvider,
      nameAndType: `${authProvider.provider.name} (${authProvider.type})`
    }
  }
}

const getUsersNotYetCleared = state => {
  return state.items.filter(item => item.status === 'confirmed by applicant')
}

const getUserRolesObjects = state => {
  return state.roles.map(role => {
    let text = ''
    switch (role) {
      case 'admin':
        text = 'Administrator'
        break
      default:
        text = role
    }
    return { text, role }
  })
}

const getters = {
  getItems: state => state.items,
  getById,
  getStatus: state => state.status,
  getRoles: state => state.roles,
  getUserRolesObjects,
  usersHaveBeenLoaded: state => state.usersHaveBeenLoaded,
  getUserName,
  getUserReferenceDataValueByTarget,
  getUsersWithAuthProvider,
  isConfirmUserAccountStateRunning: state => state.confirmUserAccountStateRunning,
  getConfirmUserAccountError: state => state.confirmUserAccountError,
  getConfirmedAccount: state => state.confirmedAccount,
  getUsersNotYetCleared,
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
