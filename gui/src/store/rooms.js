import Vue from 'vue'
import { socket } from '../plugins/socket-io'
import { sortByName } from '../functions/sortStringValues'

const state = {
  items: [],
}

// actions
const addAction = (context, building) => {
  socket.send('add-room', building)
  console.log('add-room', building)
}

const updateAction = (context, building) => {
  socket.send('update-room', building)
}

const removeAction = (context, buildingId) => {
  socket.send('remove-room', buildingId)
}

const actions = {
  addAction,
  updateAction,
  removeAction,
}

// mutations
const SOCKET_GET_ALL_ROOMS__SUCCESS = (state, response) => {
  state.items = response[0]
}

const SOCKET_UPDATE_ROOM__SUCCESS = (state, response) => {
  const item = response[0]

  const idx = state.items.findIndex(i => i._id === item._id)

  if (idx !== -1) {
    Vue.set(state.items, idx, item)
  } else {
    state.items.push(item)
  }
}

const SOCKET_REMOVE_ROOM__SUCCESS = (state, response) => {
  const buildingId = response[0]

  const idx = state.items.findIndex(i => i._id === buildingId)

  if (idx !== -1) {
    Vue.delete(state.items, idx)
  }
}

const mutations = {
  SOCKET_GET_ALL_ROOMS__SUCCESS,
  SOCKET_UPDATE_ROOM__SUCCESS,
  SOCKET_REMOVE_ROOM__SUCCESS,

}

// getters
const getters = {
  getAll: state => state.items,
  getById: state => id => state.items.find(i => i._id === id),
  getByBuildingId: state => buildingId => state.items.filter(i => i.buildingId === buildingId).sort(sortByName),
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
