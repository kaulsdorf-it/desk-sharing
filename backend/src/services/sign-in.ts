import { v4 as uuidV4 } from 'uuid'
import { LdapAuth } from '../auth-providers/ldap'
import { ICredentials } from '../types'
import { UserService } from './user'
import { EnumUserRole, User, UserStatus } from '../db-schemas/users'
import { ServerConfigService } from './server-config'
import { AuthProvider } from '../db-schemas/server-config/auth-providers'
import password from 'password-hash-and-salt'
import moment from "moment"

export class SignInService {
	static async signIn( providerId: string, credentials: ICredentials ): Promise<User> {
		const serverConfigService = new ServerConfigService()
		const serverConfig = await serverConfigService.getConfig()

		if ( !serverConfig ) {
			throw ('NO SERVER CONFIG FOUND')
		}

		const userService = new UserService()
		const userAccount: User = await userService.getByAuthProviderIdAndAccountName(providerId, credentials.accountName)

		if ( userAccount && userAccount.status !== UserStatus.ACTIVE ) {
			throw ('WRONG USER STATUS: ' + userAccount.status)
		}

		// @ts-ignore
		const authProvider: AuthProvider = serverConfig.authProviders.find(i => i._id.toString() === providerId)

		if ( authProvider === null ) {
			throw ('NO AUTH PROVIDER FOUND')
		}

		switch ( authProvider.type ) {
			case 'ldap':
				return SignInService.signLdapUser(authProvider, credentials)

			case 'local':
				return SignInService.signLocalUser(providerId, credentials)

			default:
				throw ('NO AUTH PROVIDER FOUND FOR THIS TYPE')
		}
	}

	static async reSignIn( clientId: string ): Promise<User> {
		const userService = new UserService()
		return await userService.getByClientId(clientId)
	}

	private static signLdapUser = async ( authProvider: AuthProvider, credentials: ICredentials ) => {
		try {
			const providerConfig = authProvider.provider
			const ldapConfig = {
				...providerConfig,
				tlsOptions: {
					rejectUnauthorized: false
				}
			}

			// @ts-ignore
			const ldapBindToAdminAdmin = new LdapAuth(ldapConfig, providerConfig.credentials.user, providerConfig.credentials.password)
			const ldapUser = await ldapBindToAdminAdmin.findUserByAccountName(credentials.accountName)
			const ldapBindToUser = new LdapAuth(ldapConfig, ldapUser.userPrincipalName, credentials.password)
			await ldapBindToUser.authenticate()

			const userService = new UserService()
			const newClientId = uuidV4()
			// @ts-ignore
			const user = await userService.getByAuthProviderIdAndAccountName(authProvider._id, credentials.accountName.toLowerCase())

			if ( user ) {
				if ( user.status === UserStatus.ACTIVE ) {
					const updatedUser: User = {
						...user,
						accountName: ldapUser.sAMAccountName.toLowerCase(),
						firstName: ldapUser.givenName,
						lastName: ldapUser.sn,
						status: UserStatus.ACTIVE,
						clientIds: [...user.clientIds ? user.clientIds : [], newClientId],
						mail: ldapUser.mail,
						// @ts-ignore
						authProviderId: authProvider._id,
					}

					return userService.update(updatedUser)
				} else {
					throw ('USER IS NOT ACTIVE')
				}
			} else {
				// create user
				const newUser: User = {
					createdAt: moment.utc(),
					status: UserStatus.ACTIVE,
					accountName: ldapUser.sAMAccountName.toLowerCase(),
					firstName: ldapUser.givenName,
					lastName: ldapUser.sn,
					roles: [],
					clientIds: [newClientId],
					mail: ldapUser.mail,
					// @ts-ignore
					authProviderId: authProvider._id,
				}

				const hasAnyUser = await userService.hasAnyUser()

				if ( !hasAnyUser ) {
					newUser.roles = [EnumUserRole.ADMIN]
				}

				return userService.add(newUser)
			}
		} catch ( e ) {
			console.error('ERROR in SignInService.signLdapUser()', e)
			throw e
		}
	}

	private static signLocalUser = async ( providerId: string, credentials: ICredentials ) => {
		try {
			const userService = new UserService()

			const user: User = await userService.getByAuthProviderIdAndAccountName(providerId, credentials.accountName.toLowerCase())

			if ( !user ) {
				throw ('NO USER OR WRONG PASSWORD')
			}

			if ( user.status === UserStatus.ACTIVE ) {
				const isValidPassword = await new Promise(( resolve, reject ) => {
					password(credentials.password).verifyAgainst(user.hash, ( error, verified ) => {
						if ( error ) {
							reject(error)
						} else {
							resolve(verified)
						}
					})
				})

				if ( isValidPassword ) {
					const updatedUser = {
						...user,
						clientIds: [...user.clientIds ? user.clientIds : [], uuidV4()],
					}

					return userService.update(updatedUser)
				} else {
					throw ('WRONG PASSWORD')
				}
			}
		} catch ( e ) {
			console.error('ERROR in SignInService.signLocalUser()', e)
			throw e
		}
	}
}
