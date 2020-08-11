import { ServerConfigService } from '../../../src/services/server-config'
import { AuthLocal } from '../../../src/db-schemas/server-config/auth-providers/local'


describe('ServerConfigService', () => {
	test('isKnownAuthProvider should return true on valid ldap provider config', async () => {
		const ldap = {
			// @ts-ignore
			_id: 'auth-provider-id-1',
			url: 'url',
			port: 636,
			userDN: 'userDN',
			baseDN: 'baseDN',
			credentials: {
				user: 'user',
				password: 'password',
			},
		}

		const serverConfigService = new ServerConfigService()

		// @ts-ignore
		expect(serverConfigService.isKnownAuthProvider(ldap)).toBeTruthy()
	})

	test('isKnownAuthProvider should return false on invalid ldap provider config', async () => {
		const ldap = {
			// url: 'url',
			port: 636,
			userDN: 'userDN',
			baseDN: 'baseDN',
			credentials: {
				user: 'user',
				password: 'password',
			},
		}

		const serverConfigService = new ServerConfigService()

		// @ts-ignore
		expect(serverConfigService.isKnownAuthProvider(ldap)).toBeFalsy()
	})

	test('isKnownAuthProvider should return true on valid local provider config', async () => {
		const local: AuthLocal = {
			// @ts-ignore
			_id: 'auth-provider-id-1',
			name: 'name',
			url: 'url',
			passwordExpiresInDays: 0,
			anonymizeAccountOnInactivityAfterDays: 0
		}

		const serverConfigService = new ServerConfigService()

		// @ts-ignore
		expect(serverConfigService.isKnownAuthProvider(local)).toBeTruthy()
	})

	test('isKnownAuthProvider should return false on invalid local provider config', async () => {
		const local: AuthLocal = {
			// @ts-ignore
			_id: 'auth-provider-id-1',
			name: 'name',
			// url: 'url',
			passwordExpiresInDays: 0,
			anonymizeAccountOnInactivityAfterDays: 0
		}

		const serverConfigService = new ServerConfigService()

		// @ts-ignore
		expect(serverConfigService.isKnownAuthProvider(local)).toBeFalsy()
	})
})
