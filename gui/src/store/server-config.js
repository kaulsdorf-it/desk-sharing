import { socket } from '../plugins/socket-io'
import { EventBus } from '../event-bus'

const authorityTypes = [
  { text: 'Technische Betriebsführung', value: 'technical management', icon: 'mdi-lan' },
  { text: 'Fachliche Betriebsführung', value: 'functional management', icon: 'mdi-account' },
  { text: 'Rechtlich verantwortlich', value: 'legally responsible', icon: 'mdi-format-section' },
]

const state = {
  config: {},
  serverIsRegistered: null,
  checkHostNameResult: null,
  authorityTypes,
  ldapServerUrls: [],
  technicalUsers: [],
}

// actions
const checkRegistryServerUrlAction = (context, url) => {
  socket.send('check-registry-server-url', url)
}

const registerServerAction = context => {
  const config = context.state.config

  const payload = {
    registryServerUrl: config.registryServerUrl,
    hostName: config.hostName,
    serverDescription: {
      companyName: config.companyName,
      serviceName: config.serviceName,
      organizationalUnitName: config.organizationalUnitName,
      usageType: config.usageType,
      billingData: {
        costCenter: config.costCenter,
        locationId: config.locationId,
      },
      authorities: config.authorities,
    },
    authProviders: config.authProviders,
  }

  socket.send('register-server', payload)
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

const actions = {
  checkLdapServerUrlAction,
  checkTechnicalUserAction,
  checkRegistryServerUrlAction,
  registerServerAction,
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

const SOCKET_THIS_SERVER_HAS_ALREADY_BEEN_REGISTERED = (state, response) => {
  state.serverIsRegistered = response[0]

  if (state.serverIsRegistered === false) {
    EventBus.$emit('routeTo', { to: { name: 'register-this-server' } })
  }
}

const SOCKET_CHECK_REGISTRY_SERVER_URL_SUCCESS = state => {
  state.checkHostNameResult = true
}

const SOCKET_CHECK_REGISTRY_SERVER_URL_FAILED = (state, response) => {
  state.checkHostNameResult = response[0]
}

const SOCKET_SERVER_CONFIG_SUCCESS = (state, response) => {
  state.config = response[0]
  state.serverIsRegistered = true
}

const SOCKET_REGISTER_SERVER_SUCCESS = (state, response) => {
  state.config = response[0]
  state.serverIsRegistered = true

  EventBus.$emit('routeTo', { to: { name: 'forms' } })
}

const SOCKET_SERVER_CONFIG_EMPTY = state => {
  const hostName = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port

  state.config = {
    usageType: null,
    serviceName: 'Lokaler Testserver',
    hostName,
    registryServerUrl: 'http://registry-server:3999/api',
    companyName: 'Kaulsdorf IT Solutions',
    organizationalUnitName: 'R & D',
    authorities: state.authorityTypes.map(authorityType => ({
      description: 'description example ',
      contactData: 'contactData example ',
      authorityType: authorityType.value,
    })),
    costCenter: null,
    locationId: null,
    authProviders: [],
  }
}

const setConfigValueMutation = (state, { name, value }) => {
  state.config[name] = value
}

const setAuthorityMutation = (state, authority) => {
  state.config = {
    ...state.config,
    authorities: state.config.authorities.map(item => item.authorityType === authority.authorityType ? authority : item)
  }
}

const mutations = {
  newCheckLdapServerUrlMutation,
  newCheckTechnicalUserMutation,
  resetCheckRegistryServerUrlMutation,
  setConfigValueMutation,
  setAuthorityMutation,
  SOCKET_CHECK_LDAP_SERVER_URL_RESULT,
  SOCKET_CHECK_TECHNICAL_USER_AGAINST_LDAP_RESULT,
  SOCKET_CHECK_REGISTRY_SERVER_URL_FAILED,
  SOCKET_CHECK_REGISTRY_SERVER_URL_SUCCESS,
  SOCKET_REGISTER_SERVER_SUCCESS,
  SOCKET_SERVER_CONFIG_SUCCESS,
  SOCKET_SERVER_CONFIG_EMPTY,
  SOCKET_THIS_SERVER_HAS_ALREADY_BEEN_REGISTERED,
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
  serverIsRegistered: state => state.serverIsRegistered,
  checkHostNameResult: state => state.checkHostNameResult,
  getAuthorityTypes: state => JSON.parse(JSON.stringify(state.authorityTypes)),
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
