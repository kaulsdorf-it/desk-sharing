import Vue from 'vue'
import { socket } from '../plugins/socket-io'

const state = {
  accessRights: [],
  isConnected: false,
}

const getAllAction = () => {
  socket.send('getAll.appAccessRights')
}

const saveAccessRightsAction = (context, accessRights) => {
  socket.send('update.appAccessRights', accessRights)
}

const actions = {
  getAllAction,
  saveAccessRightsAction
}

const SOCKET_CONNECT = state => {
  state.isConnected = true
}

const SOCKET_DISCONNECT = state => {
  state.isConnected = false
}

const SOCKET_SET_APP_ACCESS_RIGHTS_RESPONSE = (state, items) => {
  state.accessRights = items[0]
  state.accessRightsHaveBeenChanged = false
}

const SOCKET_UPDATE_APP_ACCESS_RIGHT_FAILED = (state, err) => {
  console.error('SOCKET_UPDATE_APP_ACCESS_RIGHT_FAILED', err)
}

const SOCKET_UPDATE_APP_ACCESS_RIGHT_RESPONSE = (state, items) => {
  const item = items[0]
  const idx = state.accessRights.findIndex(i => i._id === item._id)
  Vue.set(state.accessRights, idx, item)
}

const updateAccessRightMutation = (state, item) => {
  const idx = state.accessRights.findIndex(i => i._id === item._id)
  if (idx !== -1) {
    Vue.set(state.accessRights, idx, item)
    state.accessRightsHaveBeenChanged = true
  }
}

const SOCKET_LDAP_GROUPS_RESPONSE = (state, items) => {
  state.ldapGroups = items[0]
}

const mutations = {
  SOCKET_CONNECT,
  SOCKET_DISCONNECT,
  SOCKET_SET_APP_ACCESS_RIGHTS_RESPONSE,
  SOCKET_UPDATE_APP_ACCESS_RIGHT_RESPONSE,
  SOCKET_UPDATE_APP_ACCESS_RIGHT_FAILED,
  SOCKET_LDAP_GROUPS_RESPONSE,
  updateAccessRightMutation,
}

const getters = {
  getAccessRights: state => state.accessRights,
  getAccessRightById: state => accessRightId => {
    const idx = state.accessRights.findIndex(i => i._id === accessRightId)
    return idx !== -1 ? state.accessRights[idx] : null
  },
  isConnected: state => state.isConnected,
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
