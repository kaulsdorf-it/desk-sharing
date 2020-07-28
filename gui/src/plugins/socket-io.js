import Vue from 'vue'
import socketIoClient from 'socket.io-client'
import vueSocketIO from 'vue-socket.io'
import { reLogin } from '../store/login'
import store from '../store'

const webSocketQuery = { token: '' }
export const getToken = () => webSocketQuery.token
export const setToken = token => {
  webSocketQuery.token = token
}

export let socket = null

export const initializeWebSocketConnection = () => {
  const socketOptions = { transports: ['websocket'], query: { token: getToken() } }

  const inDevMode = process.env.NODE_ENV === 'development'

  const url = inDevMode
    ? window.location.protocol + '//localhost:3000'
    : window.location.protocol + '//' + window.location.hostname + ':' + window.location.port

  console.log('=> connect via websocket url:', url, 'env: ' + process.env.NODE_ENV)

  socket = socketIoClient(url, socketOptions)
  socket.send = (target, payload) => {
    socket.emit(target, {
      token: getToken(),
      payload
    })
  }

  socket.on('reconnect', () => {
    reLogin()
  })

  Vue.use(vueSocketIO, socket, store)
}
