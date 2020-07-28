import Vue from 'vue'
import { socket } from '../plugins/socket-io'
import store from '../store'

const state = {
  items: {},
  myBookings: {},
  isLoading: false,
}

// actions
const getShareableUnitBookingsAction = (context, roomId) => {
  socket.send('get-shareable-unit-bookings-by-room-id', roomId)
  context.commit('setLoading', true)
}

const bookAction = (context, { shareableUnitId, date, timeFrom, timeTill }) => {
  socket.send('add-shareable-unit-booking', { shareableUnitId, date, timeFrom, timeTill })
}

const actions = {
  getShareableUnitBookingsAction,
  bookAction,
}

// mutations
const setLoading = (state, isLoading) => {
  state.isLoading = isLoading
}

const SOCKET_GET_SHAREABLE_UNIT_BOOKINGS_BY_ROOM_ID__SUCCESS = (state, response) => {
  const { roomId, bookings } = response[0]

  Vue.set(state.items, roomId, bookings)
  state.isLoading = false
}

const SOCKET_UPDATE_SHAREABLE_UNIT_BOOKING__SUCCESS = (state, response) => {
  const { booking, roomId } = response[0]

  const currentUser = store.getters['login/user']
  if (currentUser._id === booking.userId) {
    if (state.myBookings[booking.date]) {
      state.myBookings[booking.date].push(booking)
    } else {
      Vue.set(state.myBookings, booking.date, [booking])
    }
  }

  if (state.items[roomId]) {
    const idx = state.items[roomId].findIndex(i => i._id === booking._id)

    if (idx === -1) {
      state.items[roomId].push(booking)
    } else {
      Vue.set(state.items[roomId], idx, booking)
    }
  } else {
    Vue.set(state.items, roomId, [booking])
  }
}

const SOCKET_GET_MY_SHAREABLE_UNIT_BOOKINGS__SUCCESS = (state, response) => {
  response[0].forEach(b => {
    if (state.myBookings[b.date]) {
      state.myBookings[b.date].push(b)
    } else {
      Vue.set(state.myBookings, b.date, [b])
    }
  })
}

const mutations = {
  setLoading,
  SOCKET_GET_SHAREABLE_UNIT_BOOKINGS_BY_ROOM_ID__SUCCESS,
  SOCKET_UPDATE_SHAREABLE_UNIT_BOOKING__SUCCESS,
  SOCKET_GET_MY_SHAREABLE_UNIT_BOOKINGS__SUCCESS,
}

// getters
const getters = {
  getByRoomIdAndShareableUnitIdAndDate: state => (roomId, shareableUnitId, date) => {
    return state.items[roomId]
      ? state.items[roomId].filter(i => i.shareableUnitId === shareableUnitId && i.date === date)
      : []
  },
  getMyBookingsByDate: state => date => state.myBookings[date] || [],
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
