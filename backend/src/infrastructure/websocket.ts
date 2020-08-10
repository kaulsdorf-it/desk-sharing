import jwt from 'jsonwebtoken'
import { ServerConfigService } from "../services/server-config"
import path from 'path'
import { checkEndpoint } from '../endpoints-ws/secure-endpoints'
import { FileUploadService } from '../services/file-uploads'
import { FileUpload } from '../db-schemas/file-uploads'
import moment from 'moment'
import { mongoose } from "@typegoose/typegoose"

export let io

export class Salt {
	private static salt = 'idaiusrzd3co9htwneiouvtco8wnpmtztno8w3qmtoe4i5vtwvo3m4ctlsehgs'

	static getSalt() {
		return Salt.salt
	}
}

export const bindWebSocketToServer = async server => {
	io = require('socket.io')(server)

	io.sockets.on('connect', async ( socket ) => {
		const appConfig = await ServerConfigService.getConfig()
		socket.emit('this_server_has_already_been_registered', !!appConfig)
		socket.emit('AUTH_PROVIDERS_SUCCESS', appConfig ? appConfig.authProviders : [])

		// handle file uploads
		const fileUploadService = new FileUploadService()
		const SocketIOFile = require('socket.io-file')

		const uploader = new SocketIOFile(socket, {
			uploadDir: '/uploads',
			maxFileSize: 10485760,
			chunkSize: 10240,
			transmissionDelay: 1,
			overwrite: false,
			rename: ( filename, fileInfo ) => {
				const objectId = mongoose.Types.ObjectId().toString()

				const file = path.parse(filename)
				const ext = file.ext

				let fileName, dir

				const fs = require('fs')

				if ( fileInfo?.data?.type === 'additionalInfoDocumentForForm' ) {
					dir = `/uploads/form--${ fileInfo.data.formId }-additional-info`
					fileName = `form--${ fileInfo.data.formId }-additional-info/${ objectId }${ ext }`
				} else {
					dir = `/uploads/${ fileInfo.data.filledFormId }`
					fileName = `${ fileInfo.data.filledFormId }/${ objectId }${ ext }`
				}

				if ( !fs.existsSync(dir) ) {
					fs.mkdirSync(dir)
				}

				return fileName
			}
		})

		uploader.on('complete', async fileInfo => {
			if ( fileInfo.name.indexOf('form--') === -1 ) {
				const pathParts = fileInfo.name.split('/')
				const nameOfFile = pathParts.pop()
				const objectId = nameOfFile.substr(0, 12)

				const fileMetaData: FileUpload = {
					_id: objectId,
					ownerId: socket.userId,
					filledFormId: fileInfo.data.filledFormId,
					originalFileName: fileInfo.originalFileName,
					name: fileInfo.name,
					mime: fileInfo.mime,
					size: fileInfo.size,
					uploadDir: fileInfo.uploadDir,
					uploaded: moment(),
				}

				try {
					await fileUploadService.add(fileMetaData)
				} catch ( e ) {
					console.error('ERROR in completing upload', e)
				}
			}
		})

		uploader.on('saved', async event => {
			event.file.clientDetail.path = event.file.pathName
		})

		uploader.on('error', err => {
			console.log('Error!', err)
		})
	})

	io.on('connect', async socket => {
		console.log('-> client has been connected')

		socket.use(async ( packet, next ) => {
			if ( packet[0].indexOf('socket.io-file::') === 0 ) {
				next()
				return
			}

			const msgTypesWithoutToken = [
				'sign-in',
				'resign-in',
				'check-mail-address',
				'does-mail-already-exist-in-any-user-account',
				'check-registry-server-url',
				'register-server',
				'does-user-account-already-exist',
				'sign-up-user',
				'confirm-user-account',
				'request-forgotten-password-mail',
				'check-new-password-request-token',
				'set-new-password',
				'does-mail-already-exist-in-any-user-account',
			]

			const msgTypesToPassThrough = [
				'siofu_start',
				'siofu_progress',
				'siofu_done',
				'check-mail-address'
			]

			if ( msgTypesToPassThrough.indexOf(packet[0]) !== -1 ) {
				next()
				return
			}

			if ( !Array.isArray(packet) || [undefined, null].indexOf(packet[1].token) !== -1 ) {
				console.log('SOCKET_GENERAL_ERROR', 'MISSING_TOKEN_ERROR ' + JSON.stringify(packet))
				socket.emit('SOCKET_GENERAL_ERROR', 'MISSING_TOKEN_ERROR ' + JSON.stringify(packet))
				next(new Error('MISSING_TOKEN_ERROR 1'))
				return
			}

			if ( msgTypesWithoutToken.indexOf(packet[0]) !== -1 ) {
				packet[1] = packet[1].payload
				next()
				return
			}

			try {
				jwt.verify(packet[1].token, Salt.getSalt())
			} catch ( err ) {
				console.log('SOCKET_GENERAL_ERROR', 'INVALID_TOKEN_ERROR', packet)
				socket.emit('SOCKET_GENERAL_ERROR', 'INVALID_TOKEN_ERROR')
				next(new Error('INVALID_TOKEN_ERROR'))
				return
			}

			if ( await checkEndpoint(socket, packet[0]) ) {
				packet[1] = packet[1].payload
				next()
				return
			}

			console.log(`ACCESS DENIED to message type <${ packet[0] }>`)
			next(new Error(`ACCESS DENIED FOR ${ packet[0] }`))
			return
		})
	})
}
