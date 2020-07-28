const events = require('events')
const eventEmitter = new events.EventEmitter()

export const emit = ( type: string, payload?: any ) => {
	eventEmitter.emit(type, payload)
}


export const subscribe = ( type: string, cb: Function ) => {
	eventEmitter.on(type, cb)
}
