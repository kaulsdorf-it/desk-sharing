import { mongoose } from "@typegoose/typegoose"
import path from "path"
import { FileUploadService } from '../services/file-uploads'
import { FileUpload } from '../db-schemas/file-uploads'

export const registerFileUploadHandler = ( socket ) => {
	const SocketIOFile = require('socket.io-file')

	const fileUploadService = new FileUploadService()

	const uploader = new SocketIOFile(socket, {
		uploadDir: '/uploads',
		maxFileSize: 10485760,
		chunkSize: 10240,
		transmissionDelay: 1,
		overwrite: false,
		rename: async ( filename, fileInfo ) => {
			const objectId = mongoose.Types.ObjectId()

			const file = path.parse(filename)
			const fileName = file.name.replace(/\s/g, "_")
			const ext = file.ext

			let uploadDir

			if ( fileInfo?.data?.type === 'form.additionalInfoDocument' ) {
				uploadDir = `form--${ fileInfo.data.formId }-additional-info--${ fileName }${ ext }`
			} else {
				uploadDir = `filed-form-${ objectId.toString() }${ ext }`
			}

			const fileMetaData: FileUpload = {
				// @ts-ignore
				_id: objectId,
				originalFileName: fileName,
				name: fileInfo.name,
				size: fileInfo.size,
				userId: socket.userId,
				uploadDir,
			}

			console.log('')
			console.log('')
			console.log('==> fileMetaData', fileMetaData)
			console.log('')

			try {
				// const response = await fileUploadService.add(fileMetaData)
				// console.log('response from db', response)
			} catch ( e ) {
				console.error('ERROR', e.stackTrace)
			}
			console.log('')
			console.log('')

			return uploadDir
		}
	})

	// file has been uploaded
	uploader.on('start', event => {
		const objectId = mongoose.Types.ObjectId().toString()
		uploader.dir = '/uploads/' + objectId
	})

	uploader.on('complete', event => {
		console.log('completed')
	})

	uploader.on('saved', async event => {
		event.file.clientDetail.path = event.file.pathName
	})

	uploader.on('error', err => {
		console.log('Error duering upload', err)
	})
}
//
// db.FileUploads.insert({
// 	_id: '5eefa94c094f3901f40f994f',
// 	originalFileName: 'Guido-Drahota_-klein',
// 	name: 'Guido-Drahota -klein.png',
// 	size: 291111,
// 	userId: '5ee8970001f82b0026f6d35c',
// 	uploadDir: '5eefa94c094f3901f40f994f_Guido-Drahota_-klein.png'
// })
