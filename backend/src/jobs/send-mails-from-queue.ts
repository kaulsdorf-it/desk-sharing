import { MailQueueService } from '../services/mail-queue'
import { ISend, MailService } from '../services/mail'
import { MailQueue } from '../db-schemas/mail-queue'
import { MailServerService } from '../services/mail-servers'

export const startProcessMailQueue = async () => {
	const mailServerService = new MailServerService()
	const mailQueueService = new MailQueueService()

	const mailQueueItems: MailQueue[] = await mailQueueService.getNextUnsent()

	if ( mailQueueItems.length > 0 ) {
		console.info(`Attempt to send ${ mailQueueItems.length } mails...`)
	}

	if ( mailQueueItems.length > 0 ) {
		for ( const mailData of mailQueueItems ) {
			const mailServer = await mailServerService.getById(mailData.mailServerId)

			const mailService = new MailService({
				host: mailServer?.host,
				port: mailServer?.port,
				secure: mailServer?.secure,
				auth: mailServer?.auth || {
					user: '',
					pass: '',
				},
			})

			const data: ISend = {
				from: `${ mailServer?.from?.name } <${ mailServer?.from?.mail }>`,
				to: mailData.to,
				cc: mailData.cc,
				bcc: mailData.bcc,
				subject: mailData.subject,
				html: mailData.content,
				attachments: mailData.attachments,
			}

			try {
				const { messageId } = await mailService.send(data)
				// @ts-ignore
				await mailQueueService.addMessageId(mailData._id, messageId)
			} catch ( e ) {
				console.error('ERROR in mailService.send() || in mailQueueService.addMessageId()', e)
				await mailQueueService.update({
					...mailData,
					attemptsToSend: mailData.attemptsToSend ? mailData.attemptsToSend + 1 : 1
				})
			}
		}
	}
}
