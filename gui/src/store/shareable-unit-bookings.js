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

const cancelBookingAction = (context, { bookingId, date, roomId }) => {
  socket.send('cancel-shareable-unit-booking', { bookingId, date, roomId })
}

const actions = {
  getShareableUnitBookingsAction,
  bookAction,
  cancelBookingAction,
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

const SOCKET_CANCEL_SHAREABLE_UNIT_BOOKING__SUCCESS = (state, response) => {
  const { bookingId, date, roomId } = response[0]

  if (state.myBookings[date]) {
    const idx = state.myBookings[date].findIndex(i => i._id === bookingId)

    if (idx !== -1) {
      if (state.myBookings[date].length === 1) {
        Vue.delete(state.myBookings, date)
      } else {
        Vue.delete(state.myBookings[date], idx)
      }
    }
  }

  if (state.items[roomId]) {
    const idx = state.items[roomId].findIndex(i => i._id === bookingId)

    if (idx !== -1) {
      if (state.items[roomId].length === 1) {
        Vue.delete(state.items, roomId)
      } else {
        Vue.delete(state.items[roomId], idx)
      }
    }
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
  SOCKET_CANCEL_SHAREABLE_UNIT_BOOKING__SUCCESS,
  SOCKET_GET_MY_SHAREABLE_UNIT_BOOKINGS__SUCCESS,
}

// getters
const getByRoomIdAndShareableUnitIdAndDate = state => (roomId, shareableUnitId, date) => {
  return state.items[roomId]
    ? state.items[roomId].filter(i => i.shareableUnitId === shareableUnitId && i.date === date)
    : []
}

const getters = {
  getByRoomIdAndShareableUnitIdAndDate,
  getMyBookingsByDate: state => date => state.myBookings[date] || [],
  getMyBookings: state => state.myBookings,
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
