import Vue from 'vue'
import { sortByName } from '../functions/sortStringValues'
import { socket } from '../plugins/socket-io'

const state = {
  items: [],
}

// actions
const addAction = (context, item) => {
  socket.send('add-shareable-unit', item)
}

const updateAction = (context, item) => {
  socket.send('update-shareable-unit', item)
}

const removeAction = (context, itemId) => {
  socket.send('remove-shareable-unit', itemId)
}

const actions = {
  addAction,
  updateAction,
  removeAction,
}

// mutations
const SOCKET_GET_ALL_SHAREABLE_UNITS__SUCCESS = (state, response) => {
  if (!response) {
    state.items = null
    return
  }

  const shareableUnits = response[0]

  state.items = shareableUnits
  state.isLoading = false
}

const SOCKET_UPDATE_SHAREABLE_UNIT__SUCCESS = (state, response) => {
  const shareableUnit = response[0]

  const idx = state.items.findIndex(i => i._id === shareableUnit._id)

  if (idx !== -1) {
    Vue.set(state.items, idx, shareableUnit)
  } else {
    // take care of
    state.items.push(shareableUnit)
  }
}

const SOCKET_REMOVE_SHAREABLE_UNIT__SUCCESS = (state, response) => {
  const shareableUnitId = response[0]

  const idx = state.items.findIndex(i => i._id === shareableUnitId)

  if (idx !== -1) {
    Vue.delete(state.items, idx)
  }
}

const mutations = {
  SOCKET_GET_ALL_SHAREABLE_UNITS__SUCCESS,
  SOCKET_UPDATE_SHAREABLE_UNIT__SUCCESS,
  SOCKET_REMOVE_SHAREABLE_UNIT__SUCCESS,
}

// getters
const getters = {
  getAll: state => state.items,
  getById: state => id => state.items.find(i => i._id === id),
  getByRoomId: state => roomId => state.items.filter(i => i.roomId === roomId).sort(sortByName),
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
