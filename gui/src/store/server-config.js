import { socket } from '../plugins/socket-io'

const state = {
  config: {},
  checkHostNameResult: null,
  ldapServerUrls: [],
  technicalUsers: [],
}

// actions
const checkRegistryServerUrlAction = (context, url) => {
  socket.send('check-registry-server-url', url)
}

const checkLdapServerUrlAction = (context, url) => {
  const urlIsNew = !context.state.ldapServerUrls.find(i => i.url === url.trim())

  if (urlIsNew) {
    context.commit('newCheckLdapServerUrlMutation', url)
  }

  socket.send('check-ldap-server-url', url)
}

const checkTechnicalUserAction = (context, { url, baseDN, userDN, user, password }) => {
  const credentialsAreNew = !context.state.technicalUsers.find(i =>
    i.user === user &&
    i.password === password &&
    i.url === url &&
    i.baseDN === baseDN &&
    i.userDN === userDN
  )

  if (credentialsAreNew) {
    context.commit('newCheckTechnicalUserMutation', { user, password, url, baseDN, userDN })
  }

  socket.send('check-technical-user-against-ldap', { user, password, url, baseDN, userDN })
}

const updateAuthProviderAction = (context, authProvider) => {
  socket.send('update-auth-provider', authProvider)
}

const actions = {
  checkLdapServerUrlAction,
  checkTechnicalUserAction,
  checkRegistryServerUrlAction,
  updateAuthProviderAction,
}

// mutations
const newCheckLdapServerUrlMutation = (state, url) => {
  state.ldapServerUrls.push({ url: url.trim(), result: null, error: null, })
}

const newCheckTechnicalUserMutation = (state, data) => {
  state.technicalUsers.push(data)
}

const SOCKET_CHECK_LDAP_SERVER_URL_RESULT = (state, response) => {
  const { url, result, error } = response[0]

  state.ldapServerUrls = state.ldapServerUrls.map(item => item.url === url ? { url, result, error } : item)
}

const SOCKET_CHECK_TECHNICAL_USER_AGAINST_LDAP_RESULT = (state, response) => {
  const { url, baseDN, userDN, user, password } = response[0]

  state.technicalUsers =
    state
      .technicalUsers
      .map(i => i.url === url && i.baseDN === baseDN && i.userDN === userDN && i.user === user && i.password === password ? response[0] : i)
}

const resetCheckRegistryServerUrlMutation = state => {
  state.checkHostNameResult = null
}

const SOCKET_GET_SERVER_CONFIG__SUCCESS = (state, response) => {
  state.config = response[0]
}

const SOCKET_SERVER_CONFIG_EMPTY = state => {
  const hostName = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port

  state.config = {
    hostName,
    authProviders: [],
  }
}

const setConfigValueMutation = (state, { name, value }) => {
  state.config[name] = value
}

const mutations = {
  newCheckLdapServerUrlMutation,
  newCheckTechnicalUserMutation,
  resetCheckRegistryServerUrlMutation,
  setConfigValueMutation,
  SOCKET_CHECK_LDAP_SERVER_URL_RESULT,
  SOCKET_CHECK_TECHNICAL_USER_AGAINST_LDAP_RESULT,
  SOCKET_GET_SERVER_CONFIG__SUCCESS,
  SOCKET_SERVER_CONFIG_EMPTY,
}

// getters
const getTechnicalUserCheckResultByConfig =
  state =>
    config =>
      state
        .technicalUsers
        .find(i =>
          i.url === config.url &&
          i.baseDN === config.baseDN &&
          i.userDN === config.userDN &&
          i.user === config.user &&
          i.password === config.password
        )

const getAuthProviders =
  state =>
    Object.keys(state.config).length > 0
      ? state.config.authProviders
      : []

const getters = {
  getConfig: state => state.config,
  getAuthProviders,
  getLdapServerUrlCheckResultByUrl: state => url => state.ldapServerUrls.find(i => i.url === url.trim()),
  getTechnicalUserCheckResultByConfig,
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
