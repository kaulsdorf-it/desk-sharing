import express from 'express'
import { FileUploadService } from '../services/file-uploads'
import jwt from 'jsonwebtoken'
import { Salt } from "./websocket"

export const serveStaticFiles = ( app: Object ) => {
	const fileUploadService = new FileUploadService()

	// @ts-ignore
	app.use('/uploads', async ( req, res, next ) => {
		let urlParts = req.originalUrl.split('/')

		if ( urlParts.length === 4 ) {
			if ( req.apiKey ) {
				try {
					jwt.verify(req.apiKey, Salt.getSalt())

					urlParts.shift()
					urlParts.shift()

					const [filledFormId, fileName] = urlParts

					const fileUpload = await fileUploadService.findByOwnerAndFilledFormId(filledFormId, fileName)

					if ( fileUpload ) {
						res.setHeader('Content-Type', fileUpload.mime)
					}
				} catch ( err ) {
					next(new Error('WRONG TOKEN'))
					return
				}
			}
		}

		next()
	})

	// @ts-ignore
	app.use('/uploads', express.static('/uploads'))

	// @ts-ignore
	app.use(( req: any, res: any, next: any ): void => {
		const startPattern = ['/form', '/fill-form', '/manage', '/admin', '/about']

		startPattern.forEach(pattern => {
			if ( req.url.indexOf(pattern) !== -1 ) {
				req.url = '/'
			}
		})

		req.url = req.url.replace('/css/fonts', '/fonts')
		req.url = req.url.replace('/css/img', '/img')

		if ( req.url.length > 2 && req.url.substr(req.url.length - 1) === '/' ) {
			req.url = req.url.substr(0, req.url.length - 1)
		}

		next()
	})

	// @ts-ignore
	app.use(( req, res, next ) => {
		console.error('Transformed to url ', req.url)
		next()
	})

	// @ts-ignore
	app.use(express.static('dist/gui'))

	// @ts-ignore
	app.use(( req, res, next ) => {
		console.error('ERROR: File not found ', req.url)
		next()
	})
}
