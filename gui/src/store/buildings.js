import Vue from 'vue'
import { socket } from '../plugins/socket-io'
import { sortByName } from '../functions/sortStringValues'

const state = {
  items: [],
}

// actions
const addAction = (context, building) => {
  socket.send('add-building', building)
}

const updateAction = (context, building) => {
  socket.send('update-building', building)
}

const removeAction = (context, buildingId) => {
  socket.send('remove-building', buildingId)
}

const actions = {
  addAction,
  updateAction,
  removeAction,
}

// mutations
const SOCKET_GET_ALL_BUILDINGS__SUCCESS = (state, response) => {
  state.items = response[0]
}

const SOCKET_UPDATE_BUILDING__SUCCESS = (state, response) => {
  const item = response[0]

  const idx = state.items.findIndex(i => i._id === item._id)

  if (idx !== -1) {
    Vue.set(state.items, idx, item)
  } else {
    state.items.push(item)
  }
}

const SOCKET_REMOVE_BUILDING__SUCCESS = (state, response) => {
  const buildingId = response[0]

  const idx = state.items.findIndex(i => i._id === buildingId)

  if (idx !== -1) {
    Vue.delete(state.items, idx)
  }
}

const mutations = {
  SOCKET_GET_ALL_BUILDINGS__SUCCESS,
  SOCKET_UPDATE_BUILDING__SUCCESS,
  SOCKET_REMOVE_BUILDING__SUCCESS,

}

// getters
const getters = {
  getAll: state => [...state.items].sort(sortByName),
  getById: state => id => state.items.find(i => i._id === id),
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
