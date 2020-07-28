import { UserService } from '../../services/user'
import { ServerConfigService } from '../../services/server-config'
import { ServerConfig } from '../../db-schemas/server-config'
import { MailServerService } from '../../services/mail-servers'
import { MailQueueService } from '../../services/mail-queue'
import moment from 'moment'

export const registerLocalAuthProviderEndpoints = ( io, socket ): void => {
	const requestForgottenPasswordMail = async ( mail: string ) => {
		const userService = new UserService()
		const mailQueueService = new MailQueueService()

		const serverConfig: ServerConfig | null = await ServerConfigService.getConfig()

		if ( !serverConfig ) {
			console.log('NO serverConfig')
			return
		}

		const localAuthProvider = serverConfig.authProviders.find(authProvider => authProvider.type === 'local')

		if ( !localAuthProvider ) {
			console.log('NO localAuthProvider')
			return
		}

		const mailServerService = new MailServerService()
		const mailServers = await mailServerService.getAll()
		const mailServer = mailServers.length > 0
			? mailServers[0]
			: null

		if ( mailServer ) {
			// @ts-ignore
			const user = await userService.getByAuthProviderIdAndMail(localAuthProvider._id, mail)

			if ( user ) {
				// @ts-ignore
				const tokenRequest = await userService.createNewPasswordRequestToken(user._id)
				const link = serverConfig.hostName + (serverConfig.hostName.endsWith('/') ? '' : '/') + 'change-password/' + tokenRequest.token

				await mailQueueService.add({
					createdAt: moment.utc(),
					// @ts-ignore
					mailServerId: mailServer._id,
					to: [mail],
					subject: `Neues Kennwort für Ihr Benutzerkonto bei ${ serverConfig.hostName }`,
					content: `Sie beabsichtigen, für den Dienst ${ serverConfig.hostName } beabsichtigen Sie, ein neues Kennwort zu vergeben.
<br/> 
<br/>
Sollten Sie kein neues Kennwort benötigen, ignorieren Sie diese E-Mail einfach.
<br/>
<br/>
Bitte klicken Sie auf diesen <a href='${ link }'>Link</a>, um jetzt Ihr Kennwort zu ändern.
<br/>
Dieser Link ist gültig bis zum ${ tokenRequest.validUntil.format('DD.MM.Y HH:mm') } Uhr.
<br/>
<br/>
${ serverConfig.hostName }`,
				})
			}
		}
	}

	const checkNewPasswordRequestToken = async ( token: string ) => {
		const userService = new UserService()

		let isTokenValid = false

		try {
			isTokenValid = await userService.getByNewPasswordRequestToken(token)
		} catch ( e ) {
		} finally {
			socket.emit('CHECK_CHANGE_PASSWORD_TOKEN_RESPONSE', { token, result: isTokenValid })
		}
	}

	const setNewPassword = async ( { token, password } ): Promise<void> => {
		const userService = new UserService()

		try {
			await userService.setNewPassword(token, password)
			socket.emit('SET_PASSWORD_SUCCESS')
		} catch ( e ) {
			socket.emit('SET_PASSWORD_FAILED', e)
		}
	}

	interface IDoesMailAlreadyExistInAnyUserAccount {
		mail: string
		authProviderId: string
		ownAccountId: string | null
	}

	const doesMailAlreadyExistInAnyUserAccount = async ( payload: IDoesMailAlreadyExistInAnyUserAccount ): Promise<void> => {
		const userService = new UserService()

		try {
			const user = await userService.getByAuthProviderIdAndMail(payload.authProviderId, payload.mail)

			if ( user ) {
				// @ts-ignore
				if ( !payload.ownAccountId || payload.ownAccountId === user._id ) {
					console.log('DOES_MAIL_ALREADY_EXIST_IN_ANY_USER_ACCOUNT_RESPONSE', true)
					socket.emit('DOES_MAIL_ALREADY_EXIST_IN_ANY_USER_ACCOUNT_RESPONSE', true)
					return
				}
			}
		} catch ( e ) {
		}

		console.log('DOES_MAIL_ALREADY_EXIST_IN_ANY_USER_ACCOUNT_RESPONSE', false)
		socket.emit('DOES_MAIL_ALREADY_EXIST_IN_ANY_USER_ACCOUNT_RESPONSE', false)
	}

	socket
		.on('request-forgotten-password-mail', requestForgottenPasswordMail)
		.on('check-new-password-request-token', checkNewPasswordRequestToken)
		.on('set-new-password', setNewPassword)
		.on('does-mail-already-exist-in-any-user-account', doesMailAlreadyExistInAnyUserAccount)

}
