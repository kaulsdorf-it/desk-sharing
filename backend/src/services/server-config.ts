import { ServerConfigRepository } from '../repositories/server-config'
import { ServerConfig } from '../db-schemas/server-config'
import { emit } from '../message-bus'
import { AuthProvider } from "../db-schemas/server-config/auth-providers"

export class ServerConfigService {
	private readonly repository = new ServerConfigRepository()

	async getConfig(): Promise<ServerConfig | null> {
		return this.repository.getConfig()
	}

	async add( config: ServerConfig ): Promise<ServerConfig | null> {
		await this.repository.add(config)
		emit('loadConfigFromRegistry')
		return this.repository.getConfig()
	}

	async updateAuthProviders( authProvider: AuthProvider ): Promise<ServerConfig | null> {
		if ( !this.isKnownAuthProvider(authProvider.provider) ) {
			throw Error('ARGUMENT IS NOT A VALID AUTH PROVIDER')
		}

		await this.updateAuthProviderConfig(authProvider)

		return this.getConfig()
	}

	private isKnownAuthProvider( authProviderConfig: any ): Boolean {
		const ldapConfigAttrs = ['name', 'url', 'userDN', 'baseDN', 'credentials']
		const localConfigAttrs = ['name', 'url', 'passwordExpiresInDays', 'anonymizeAccountOnInactivityAfterDays']

		const isLdapConfig = ldapConfigAttrs.every(attr => authProviderConfig.hasOwnProperty(attr))
		const isLocalConfig = localConfigAttrs.every(attr => authProviderConfig.hasOwnProperty(attr))

		return isLdapConfig || isLocalConfig
	}

	private async updateAuthProviderConfig( authProvider: AuthProvider ) {
		const serverConfig = await this.getConfig()

		if ( !serverConfig ) {
			throw Error('NO SERVER CONFIG FOUND')
		}

		if ( !serverConfig.authProviders ) {
			serverConfig.authProviders = []
		}

		if ( authProvider.hasOwnProperty('_id') ) {
			serverConfig.authProviders = serverConfig.authProviders.map(item => {
				// @ts-ignore
				return item._id === authProvider._id
					? authProvider
					: item
			})
		} else {
			serverConfig.authProviders.push(authProvider)
		}

		// @ts-ignore
		return this.repository.update(serverConfig)
	}
}
