import mailer from 'nodemailer'
import { Attachment } from '../../db-schemas/mail-queue'

export interface ISend {
	from: string[] | string
	to: string[] | string
	cc?: string[] | string
	bcc?: string[] | string
	subject: string
	text?: string
	html?: string
	attachments?: Attachment[]
}

export class MailService {
	private readonly transporter

	constructor( smtpServerConfig ) {
		this.transporter = mailer.createTransport(smtpServerConfig)
	}

	async send( args: ISend ): Promise<any> {
		const { from, to, cc, bcc, subject, text, html, attachments } = args

		const getArray = data => Array.isArray(data) ? data.join(', ') : data

		const mail = {
			from: getArray(from),
			to: getArray(to),
			cc: getArray(cc),
			bc: getArray(bcc),
			subject,
			text,
			html,
			attachments,
		}

		try {
			return this.transporter.sendMail(mail)
		} catch ( error ) {
			console.error('ERROR in MailService.send()', error)
		}
	}
}
