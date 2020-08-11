import { ServerConfigService } from '../services/server-config'
import ActiveDirectory from 'activedirectory'
import { ILdapUser, LdapAuth } from '../auth-providers/ldap'
import Moment from 'moment'
import { AuthProvider } from "../db-schemas/server-config/auth-providers"

export const registerServerConfigEndpoints = ( io, socket ): void => {
	const checkLdapServerUrl = async ( url: string ) => {
		const options = {
			url,
			tlsOptions: {
				rejectUnauthorized: false
			},
			timeout: 1000,
			idleTimeout: 1000,
		}

		try {
			const ad = new ActiveDirectory(options)

			ad.getRootDSE(url, ( error, result ) => {
				const response = { url, error, result }
				socket.emit('CHECK_LDAP_SERVER_URL_RESULT', response)
			})
		} catch ( error ) {
			const response = { url, error }
			socket.emit('CHECK_LDAP_SERVER_URL_RESULT', response)
		}
	}

	interface ICheckTechnicalUserAgainstLdap {
		url: string
		user: string
		password: string
		baseDN: string
		userDN: string
		result?: ILdapUser
		error?: Error
	}

	const checkTechnicalUserAgainstLdap = async ( { url, user, password, baseDN, userDN } ) => {
		const options = {
			url,
			baseDN,
			userDN,
			tlsOptions: {
				rejectUnauthorized: false
			},
			timeout: 1000,
			idleTimeout: 1000,
			username: user,
			password,
		}

		const response: ICheckTechnicalUserAgainstLdap = { url, user, password, baseDN, userDN }

		try {
			const ad = new LdapAuth(options, user, password)
			response.result = await ad.getLdapUser()
		} catch ( error ) {
			console.error('ERROR on "checkTechnicalUserAgainstLdap"', error)
			response.error = error
		} finally {
			socket.emit('CHECK_TECHNICAL_USER_AGAINST_LDAP_RESULT', response)
		}
	}

	const registerServer = async ( registration ) => {
		try {
			const serverConfigService = new ServerConfigService()
			const serverConfig = await serverConfigService.add({
				...registration,
				lastUpdated: Moment.utc(),
			})
			if ( !serverConfig ) {
				throw ('NO SERVER CONFIG FOUND')
			}

			socket.emit('AUTH_PROVIDERS_SUCCESS', serverConfig.authProviders)
			socket.emit('register_server_success', serverConfig)
		} catch ( e ) {
			console.error('ERROR on "register-server"', e)
		}
	}

	const updateAuthProvider = async ( authProvider: AuthProvider ) => {
		try {
			const serverConfigService = new ServerConfigService()
			const updatedServerConfig = await serverConfigService.updateAuthProviders(authProvider)

			socket.emit('UPDATE_SERVER_CONFIG__SUCCESS', updatedServerConfig)
		} catch ( e ) {
			console.error('UPDATE_SERVER_CONFIG__FAILED', e)
			socket.emit('UPDATE_SERVER_CONFIG__FAILED', e)
		}
	}

	socket
		.on('check-ldap-server-url', checkLdapServerUrl)
		.on('check-technical-user-against-ldap', checkTechnicalUserAgainstLdap)
		.on('update-auth-provider', updateAuthProvider)
		.on('register-server', registerServer)
}
