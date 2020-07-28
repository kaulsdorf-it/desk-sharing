import { MailQueueService } from '../services/mail-queue'
import { ISend, MailService } from '../services/mail'
import { MailQueue } from '../db-schemas/mail-queue'
import { ServerConfigService } from '../services/server-config'
import { MailServerService } from '../services/mail-servers'
import { UsageTypeEnum } from '../db-schemas/server-config'

export const startProcessMailQueue = async () => {
	const mailServerService = new MailServerService()
	const mailQueueService = new MailQueueService()

	const mailQueueItems: MailQueue[] = await mailQueueService.getNextUnsent()

	if ( mailQueueItems.length > 0 ) {
		console.info(`Attempt to send ${ mailQueueItems.length } mails...`)
	}

	if ( mailQueueItems.length > 0 ) {
		const serverConfig = await ServerConfigService.getConfig()

		let contentPrefix = ''

		if ( serverConfig?.serverDescription.usageType !== UsageTypeEnum.PRODUCTION ) {
			contentPrefix = `
			<div style="color: darkred; font-weight: bold;">
				<div>=================================================================================================</div>
				<div>Dies ist KEIN Produktiv-, sondern ein ${ serverConfig?.serverDescription.usageType }-System!</div>
				<div>Bitte verzichten Sie auf diesem Server weitestgehend auf die Eingabe von personenbezogenen Daten.</div>
				<div>=================================================================================================</div>
			</div>
			<br/><br/>`
		}

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
				html: contentPrefix + mailData.content,
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
