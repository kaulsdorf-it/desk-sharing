import { setToken, socket } from '../plugins/socket-io'
import { EventBus } from '../event-bus'

const state = {
  authProviders: [],
  loginInProgress: false,
  loggedIn: false,
  user: null,
  client: null,
  requestedRouteBeforeLogin: null,
  error: null,
  token: null,
  changePasswordRequest: null,
}

const login = (context, { providerId, payload }) => {
  context.commit('setLoginInProgressMutation')
  socket.send('sign-in', { providerId, payload })
}

export const reLogin = () => {
  const clientId = localStorage.getItem('client-token')

  if (clientId && clientId.length > 10) {
    socket.send('resign-in', clientId)
  } else {
    EventBus.$emit('routeTo', { to: '/login' })
  }
}

const logout = () => {
  const clientId = localStorage.getItem('client-token')
  socket.send('sign-out', clientId)
  localStorage.removeItem('client-token')
  EventBus.$emit('routeTo', { to: '/login' })
}

const requestForgottenPasswordMailAction = (context, mail) => {
  socket.send('request-forgotten-password-mail', mail)
}

const checkNewPasswordRequestTokenAction = (context, token) => {
  context.commit('checkNewPasswordTokenMutation', token)
  setTimeout(() => socket.send('check-new-password-request-token', token), 3000)
}

const setNewPasswordAction = (context, { token, password }) => {
  socket.send('set-new-password', { token, password })
}

const actions = {
  login,
  reLogin,
  logout,
  requestForgottenPasswordMailAction,
  checkNewPasswordRequestTokenAction,
  setNewPasswordAction,
}

// mutations
const checkNewPasswordTokenMutation = (state, token) => {
  state.changePasswordRequest = { token, result: null }
}

const SOCKET_CHECK_CHANGE_PASSWORD_TOKEN_RESPONSE = (state, response) => {
  const { token, result } = response[0]

  if (state.changePasswordRequest.token === token) {
    state.changePasswordRequest.result = result
  }
}

const setLoginInProgressMutation = state => {
  state.loginInProgress = true
}

const SOCKET_SIGN_IN_SUCCESS = (state, response) => {
  const user = response[0]

  state.loginInProgress = false
  state.loggedIn = true
  state.user = user
  state.error = null
  localStorage.setItem('client-token', user.clientIds[user.clientIds.length - 1])
}

const SOCKET_RE_SIGN_IN_SUCCESS = (state, response) => {
  const user = response[0]

  state.loginInProgress = false
  state.loggedIn = true
  state.user = user
  state.error = null
}

const SOCKET_SIGN_IN_FAILED = (state, response) => {
  state.loginInProgress = false
  state.loggedIn = false
  state.client = null
  state.error = response[0]
}

// When logout was triggered from other socket:
const SOCKET_SIGNED_OUT = state => {
  state.loggedIn = false
  state.client = null
  state.user = null
}

const SOCKET_AUTHENTICATED = (state, response) => {
  state.token = response[0]
  setToken(response[0])
}

const updateUserMutation = (state, user) => {
  state.user = user
}

const resetErrorMutation = state => {
  state.error = null
}

const setRequestedRouteBeforeLoginMutation = (state, routeObj) => {
  state.requestedRouteBeforeLogin = routeObj
}

const SOCKET_AUTH_PROVIDERS_SUCCESS = (state, response) => {
  state.authProviders = response[0]
}

const mutations = {
  checkNewPasswordTokenMutation,
  resetErrorMutation,
  setLoginInProgressMutation,
  setRequestedRouteBeforeLoginMutation,
  SOCKET_CHECK_CHANGE_PASSWORD_TOKEN_RESPONSE,
  SOCKET_SIGN_IN_SUCCESS,
  SOCKET_SIGN_IN_FAILED,
  SOCKET_RE_SIGN_IN_SUCCESS,
  SOCKET_SIGNED_OUT,
  SOCKET_AUTHENTICATED,
  SOCKET_AUTH_PROVIDERS_SUCCESS,
  updateUserMutation,
}

const getReferenceDataValueByTarget = state => target => {
  const userReferenceData = state.user.userReferenceData.data
  return userReferenceData[target]
}

const getChangePasswordRequest = state => token => {
  return state.changePasswordRequest && state.changePasswordRequest.token === token
    ? state.changePasswordRequest
    : null
}

const getters = {
  user: state => state.user,
  userIsLoggedIn: state => state.loggedIn,
  getLoginError: state => state.error,
  getLoginInProgress: state => state.loginInProgress,
  getReferenceDataValueByTarget,
  getAuthProviders: state => state.authProviders,
  getChangePasswordRequest,
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
