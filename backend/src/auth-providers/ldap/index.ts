import ActiveDirectory from 'activedirectory'

interface ILdapConfig {
	url: string
	baseDN: string
	userDN: string
	secure: boolean
	username: string
	password: string
}

export interface ILdapUser {
	dn: string
	userPrincipalName: string
	sAMAccountName: string
	mail: string
	lockoutTime: string
	whenCreated: string
	pwdLastSet: string
	userAccountControl: string
	sn: string
	givenName: string
	cn: string
	displayName: string
	comment: string
	description: string
}

export class LdapAuth {
	private readonly config: ILdapConfig
	public ldapCon

	constructor( config, username, password ) {
		this.config = { ...config, username, password }

		const userAttributes = [
			'dn',
			'userPrincipalName',
			'sAMAccountName',
			'mail',
			'lockoutTime',
			'whenCreated',
			'pwdLastSet',
			'userAccountControl',
			'employeeID',
			'sn',
			'givenName',
			'initials',
			'cn',
			'displayName',
			'comment',
			'description',
			'db-Ext-SingleValue-noind-04',
		]

		try {
			this.ldapCon = new ActiveDirectory(this.config, null, null, null, { attributes: { user: userAttributes } })
		} catch ( err ) {
			console.error('ERROR in LdapAuth.constructor()', err)
		}
	}

	async getLdapUser(): Promise<ILdapUser> {
		return new Promise(( resolve, reject ) => {
			this.ldapCon.findUser(this.config.username, true, ( err, user ) => {
				if ( err ) {
					console.log('Error getting user data', err)
					reject(err)
				}

				if ( !user ) {
					console.log('User not found.')
					reject('User not found')
				} else {
					resolve(user)
				}
			})
		})
	}

	async authenticate(): Promise<boolean> {
		return new Promise(( resolve, reject ) => {
			this.ldapCon.authenticate(this.config.username, this.config.password, async ( err: any, auth: boolean ) => {
				if ( err ) {
					console.error('ERROR in AuthProvider.LDAP.authenticate()', err)
					let errStr
					try {
						errStr = JSON.stringify(err)
					} catch ( e ) {
						errStr = 'unknown error'
					}

					if ( errStr.indexOf('data 52e') !== -1 || errStr.indexOf('data 775') !== -1 ) {
						console.log('Invalid Credentials')
					}
					reject('WRONG PASSWORD')
				}

				if ( auth ) {
					console.log('Authentication successful!')
					resolve(true)
				} else {
					console.log('Authentication failed!')
					reject('AUTHENTICATION FAILED')
				}
			})
		})
	}

	async findUserByAccountName( accountName: string ): Promise<ILdapUser> {
		return new Promise(( resolve, reject ) => {
			const query = 'cn=' + accountName

			this.ldapCon.find(query, ( err, results ) => {
				if ( err ) {
					reject(err)
				} else {
					if ( results && results.users && results.users.length > 0 ) {
						resolve(results.users[0])
					} else {
						reject('NO USER FOUND')
					}
				}
			})
		})
	}

	async getUserGroups( user: any ): Promise<string[]> {
		interface ILdapGroupObject {
			cn: string
		}

		return new Promise(( resolve, reject ) => {
			this.ldapCon.getGroupMembershipForUser(user.sAMAccountName, ( err: any, ldapGroupObjects: ILdapGroupObject[] ) => {
				if ( err ) {
					console.log('Could not get Users group membership')
					reject(err)
				}

				const groups = ldapGroupObjects.map(ldapGroupObject => ldapGroupObject.cn)
				resolve(groups)
			})
		})
	}
}
