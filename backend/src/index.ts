import addTimeStampToConsole from './utils/add-timestamp-to-console'
import express from 'express'
import { serveStaticFiles } from './infrastructure/static-files'
import { registerWebSocketEndpoints } from './endpoints-ws'
import { bindWebSocketToServer } from './infrastructure/websocket'
import { closeConnection, startRestServer } from './infrastructure/start-rest'
import { detectApiKey } from './infrastructure/detect-api-key'
import Jobs from './jobs'
import MongoDb from './infrastructure/mongodb'
import http from 'http'
import { populateDemoData } from './db-schemas/default-docs'

const config = require('./config')

addTimeStampToConsole()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const server = http.createServer(app)

const start = async () => {
	try {
		console.log('===========================================================')
		console.log('desc-sharing-backend')
		console.log('===========================================================')

		const mongodb = new MongoDb(config)
		await mongodb.connect()

		await populateDemoData()

		await bindWebSocketToServer(server)

		app.use(detectApiKey)

		serveStaticFiles(app)

		registerWebSocketEndpoints()

		await startRestServer(server)

		Jobs.startCronJobs()

		console.log('== SERVER STARTUP SUCCESSFULLY ============================')
		console.log('')
	} catch ( err ) {
		console.log('= ERROR during server startup:                            =')
		console.log(err)
		console.log('========= SERVER STARTUP STOPPED ==========================')
		closeConnection()
		process.exit(1)
	}
}

// start the app
(async () => start())()
