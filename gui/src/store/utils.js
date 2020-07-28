import { socket } from '../plugins/socket-io'

const state = {
  checkedMailAddresses: [],
  dnd: {
    draggedElementId: null,
    overElementId: null,
    isAllowed: false
  },
}

// actions
const checkMailAction = (context, mailAddress) => {
  if (mailAddress && mailAddress.length > 6) {
    context.commit('addCheckMailAddressRequestMutation', mailAddress)
    socket.send('check-mail-address', mailAddress)
  }
}

const actions = {
  checkMailAction,
}

// mutations
const addCheckMailAddressRequestMutation = (state, mailAddress) => {
  if (!state.checkedMailAddresses.find(item => item.mailAddress === mailAddress)) {
    state.checkedMailAddresses.push({ mailAddress, state: 'pending' })
  }
}

const SOCKET_CHECK_MAIL_ADDRESS_SUCCESS = (state, response) => {
  const { mailAddress, isValid } = response[0]

  const items = [...state.checkedMailAddresses]
  const idx = items.findIndex(item => item.mailAddress === mailAddress)

  if (idx !== -1) {
    items[idx] = {
      ...items[idx],
      state: 'validated',
      isValid
    }

    state.checkedMailAddresses = items
  }
}

const startDraggingMutation = (state, elementId) => {
  state.dnd.draggedElementId = elementId
}

const dragEnterMutation = (state, { overElementId, isAllowed }) => {
  state.dnd.overElementId = overElementId
  state.dnd.isAllowed = isAllowed
}

const endDnDMutation = state => {
  state.dnd = {
    draggedElementId: null,
    overElementId: null,
    isAllowed: false,
  }
}

const mutations = {
  addCheckMailAddressRequestMutation,
  SOCKET_CHECK_MAIL_ADDRESS_SUCCESS,
  startDraggingMutation,
  dragEnterMutation,
  endDnDMutation,
}

// getters
const getters = {
  getByMailAddress: state => mailAddress => state.checkedMailAddresses.find(item => item.mailAddress === mailAddress),
  getDnDState: state => state.dnd,
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
