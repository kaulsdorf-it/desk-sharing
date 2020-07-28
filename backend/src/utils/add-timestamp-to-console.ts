import moment from 'moment'

const logThis = function (this: any, message: any, loglevel: string, console, ...params: any[]) {
	const date = `[${moment().format('HH:mm:ss:SS')}]`
	if (typeof message === 'string') {
		params.unshift(`${date} ${loglevel} ${message}`)
	} else {
		params.unshift(message)
		params.unshift(loglevel)
		params.unshift(date)
	}
	console.apply(this, params)
}

export default () => {
	const log = console.log
	const trace = console.trace
	const debug = console.debug
	const info = console.info
	const warn = console.warn
	const error = console.error
	console.log = function (message, ...params) { logThis(message, "LOG", log, ...params) }
	console.trace = function (message, ...params) { logThis(message, "TRACE", trace, ...params) }
	console.debug = function (message, ...params) { logThis(message, "DEBUG", debug, ...params) }
	console.info = function (message, ...params) { logThis(message, "INFO", info, ...params) }
	console.warn = function (message, ...params) { logThis(message, "WARN", warn, ...params) }
	console.error = function (message, ...params) { logThis(message, "ERROR", error, ...params) }
}
