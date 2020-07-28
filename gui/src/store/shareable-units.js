import { sortByName } from '../functions/sortStringValues'

const state = {
  items: [],
}

// actions
const actions = {}

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

const mutations = {
  SOCKET_GET_ALL_SHAREABLE_UNITS__SUCCESS,
  SOCKET_UPDATE_SHAREABLE_UNIT__SUCCESS,
}

// getters
const getters = {
  getAll: state => state.items,
  getByRoomId: state => roomId => state.items.filter(i => i.roomId === roomId).sort(sortByName),
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
