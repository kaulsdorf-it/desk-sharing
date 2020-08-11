import { MailValidationService } from '../services/check-mail'

export const registerUtilsEndpoints = ( io, socket ): void => {
	const checkMailAddress = async ( mailAddress: string ): Promise<void> => {
		try {
			const isValid = await MailValidationService.validate(mailAddress)
			socket.emit('check_mail_address_success', { mailAddress, isValid })
		} catch ( err ) {
			console.log('ERROR in endpoint "check-mail-address"', err)
		}
	}

	socket
		.on('check-mail-address', checkMailAddress)
}
