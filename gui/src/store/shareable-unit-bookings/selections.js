const state = {
  date: null,
  buildingId: null,
  roomId: null,
  timeFrom: '08:00',
  timeTill: '17:00',
}

// mutations
const selectDateMutation = (state, value) => {
  state.date = value
}

const selectBuildingIdMutation = (state, value) => {
  state.buildingId = value
}

const selectRoomIdMutation = (state, value) => {
  state.roomId = value
}

const selectTimeFromMutation = (state, value) => {
  state.timeFrom = value
}

const selectTimeTillMutation = (state, value) => {
  state.timeTill = value
}

const mutations = {
  selectDateMutation,
  selectBuildingIdMutation,
  selectRoomIdMutation,
  selectTimeFromMutation,
  selectTimeTillMutation,
}

// getters
const getters = {
  getDate: state => state.date,
  getBuildingId: state => state.buildingId,
  getRoomId: state => state.roomId,
  getTimeFrom: state => state.timeFrom,
  getTimeTill: state => state.timeTill,
}

export default {
  namespaced: true,
  state,
  mutations,
  getters
}
