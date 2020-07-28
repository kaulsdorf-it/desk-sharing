import Vue from 'vue'
import { socket } from '../../plugins/socket-io'

const state = {
  items: [],
}

// actions
const addAction = (context, mailServer) => {
  socket.send('add-mail-server', mailServer)
}

const updateAction = (context, mailServer) => {
  socket.send('update-mail-server', mailServer)
}

const removeAction = (context, id) => {
  socket.send('remove-mail-server', id)
}

const actions = {
  addAction,
  updateAction,
  removeAction,
}

// mutations
const SOCKET_GET_ALL_MAIL_SERVERS_SUCCESS = (state, response) => {
  const mailServer = response[0]
  state.items = mailServer
}

const SOCKET_UPDATE_MAIL_SERVER_SUCCESS = (state, response) => {
  const mailServer = response[0]
  const idx = state.items.findIndex(i => i._id === mailServer._id)

  if (idx !== -1) {
    Vue.set(state.items, idx, mailServer)
  } else {
    state.items.push(mailServer)
  }
}

const SOCKET_REMOVE_MAIL_SERVER_SUCCESS = (state, response) => {
  const id = response[0]
  const idx = state.items.findIndex(i => i._id === id)

  console.log('SOCKET_REMOVE_MAIL_SERVER_SUCCESS', idx, id)

  if (idx !== -1) {
    Vue.delete(state.items, idx)
  }
}

const mutations = {
  SOCKET_GET_ALL_MAIL_SERVERS_SUCCESS,
  SOCKET_UPDATE_MAIL_SERVER_SUCCESS,
  SOCKET_REMOVE_MAIL_SERVER_SUCCESS,
}

// getters
const getters = {
  getAll: state => state.items,
  getById: state => id => state.items.find(i => i._id === id),
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
