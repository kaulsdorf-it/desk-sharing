import moment from 'moment'
import { UserRepository } from '../repositories/user'
import { ServerConfigService } from './server-config'
import { EnumUserRole, NewPasswordRequest, User, UserStatus } from '../db-schemas/users'
import { MailQueueService } from './mail-queue'
import { MailServerService } from './mail-servers'
import { MailQueue } from "../db-schemas/mail-queue"
import { ServerConfig } from '../db-schemas/server-config'
import passwordHashAndSalt from 'password-hash-and-salt'
import { nanoid } from 'nanoid'

export interface IUserApplication {
	accountName: string
	password: string
	firstName: string
	lastName: string
	mail: string
	authProviderId: string
}

export class UserService {
	private readonly repository

	constructor() {
		this.repository = new UserRepository()
	}

	async hasAnyUser(): Promise<boolean> {
		return this.repository.hasAnyUser()
	}

	async getAll(): Promise<User[]> {
		return this.repository.getAll()
	}

	async getById( _id: string ): Promise<User> {
		return this.repository.get(_id)
	}

	async getByClientId( clientId: string ) {
		return this.repository.getByClientId(clientId)
	}

	async getByAuthProviderIdAndAccountName( providerId: string, accountName: string ) {
		return this.repository.getByAccountName(providerId, accountName)
	}

	async getByAuthProviderIdAndMail( authProviderId: string, mail: string ): Promise<User> {
		return this.repository.getByAuthProviderIdAndMail(authProviderId, mail)
	}

	async getByNewPasswordRequestToken( token: string ): Promise<boolean> {
		const user = await this.repository.getByNewPasswordRequestToken(token)
		if ( !user ) {
			throw ('NO USER FOUND')
		}

		return new Promise(resolve => resolve(moment(user.newPasswordRequest.validUntil).isAfter()))
	}

	static getUserStatus() {
		return [UserStatus.UNCONFIRMED, UserStatus.CONFIRMED_BY_APPLICANT, UserStatus.ACTIVE, UserStatus.INACTIVE]
	}

	async add( user: User ) {
		const numberOfUsers = await this.repository.countAll()
		if ( numberOfUsers === 0 ) {
			user.roles = [EnumUserRole.ADMIN]
			user.status = UserStatus.ACTIVE
		}

		const serverConfig: ServerConfig | null = await ServerConfigService.getConfig()

		if ( serverConfig === null ) {
			throw ('NO SERVER CONFIG FOUND')
		}

		const dbResponse = await this.repository.create(user)

		return this.getById(dbResponse._id)
	}

	async addLocal( userApplication: IUserApplication ) {
		let hash

		try {
			hash = await new Promise(( resolve, reject ) => {
				passwordHashAndSalt(userApplication.password).hash(( err, hash ) => {
					if ( err ) {
						reject(err)
					} else {
						resolve(hash)
					}
				})
			})
		} catch ( e ) {
			throw ('CANNOT ENCRYPT PASSWORD')
		}

		const user: User = {
			createdAt: moment.utc(),
			accountName: userApplication.accountName,
			authProviderId: userApplication.authProviderId,
			status: UserStatus.UNCONFIRMED,
			mail: userApplication.mail,
			roles: [],
			firstName: userApplication.firstName,
			lastName: userApplication.lastName,
			hash: hash
		}

		const numberOfUsers = await this.repository.countAll()
		if ( numberOfUsers === 0 ) {
			user.roles = [EnumUserRole.ADMIN, EnumUserRole.FORM_DESIGNER, EnumUserRole.FORM_STAGE_MANAGER]
			user.status = UserStatus.ACTIVE
		}

		const serverConfig: ServerConfig | null = await ServerConfigService.getConfig()

		if ( serverConfig === null ) {
			throw ('SERVER CONFIG FOUND')
		}

		const dbResponse = await this.repository.create(user)

		const mailQueueService = new MailQueueService()

		const confirmationLink = serverConfig.hostName + (serverConfig.hostName.endsWith('/') ? '' : '/') + 'confirm-user-account/' + dbResponse._id

		const mailServerService = new MailServerService()
		const mailServers = await mailServerService.getAll()
		const mailServer = mailServers.length > 0
			? mailServers[0]
			: null

		if ( mailServer ) {
			const mail: MailQueue = {
				createdAt: moment.utc(),
				// @ts-ignore
				mailServerId: mailServer._id,
				to: [user.mail, 'guido.drahota@deutschebahn.com'],
				subject: 'Bitte bestätigen Sie Ihre Registrierung!',
				content: `Willkommen bei Desk Sharing!
<br/><br/>
Mit dieser E-Mail-Adresse ist soeben ein Benutzerkonto beantragt worden.
<br/><br/>
Sollten Sie dieses Benutzerkonto NICHT beantragt haben, unternehmen Sie nichts. Wir löschen diesen Antrag nach zwei Kalendertagen automatisch.
<br/>
<br/>
<b>Bitte klicken Sie <a href="${ confirmationLink }">hier</a>, um Ihren Antrag zu bestätigen!</b>
<br/><br/><br/>
Desk Sharing
`
			}
			await mailQueueService.add(mail)

			return this.getById(dbResponse._id)
		}
	}

	async updateReferenceData( userId: string, referenceData: any ): Promise<User> {
		return this.repository.updateReferenceData(userId, referenceData)
	}

	async update( user: User ) {
		return this.repository.update(user)
	}

	async delete( _id: string ) {
		return this.repository.delete(_id)
	}

	async confirmUser( userId: string ): Promise<User> {
		const user = await this.getById(userId)

		if ( !user ) {
			throw ('NO USER FOUND')
		}

		if ( user.status === UserStatus.INACTIVE ) {
			throw ('USER HAS BEEN DEACTIVATED')
		}

		if ( user.status === UserStatus.UNCONFIRMED ) {
			await this.update({
				...user,
				status: UserStatus.CONFIRMED_BY_APPLICANT,
			})
		}

		return this.getById(userId)
	}

	static getUserRoles() {
		return Object.values(EnumUserRole)
	}

	async getUserByAccountName( accountName: string ) {
		return this.repository.getUserByAccountName(accountName)
	}

	async hasUserRole( socket: any, role: EnumUserRole ): Promise<boolean> {
		const user = await this.getById(socket.userId)
		return new Promise(resolve => resolve(user && user.roles.indexOf(role) !== -1))
	}

	async createNewPasswordRequestToken( userId: string ): Promise<NewPasswordRequest> {
		const user = await this.getById(userId)
		const newPasswordRequest: NewPasswordRequest = {
			token: nanoid(),
			validUntil: moment.utc().add(2, 'days')
		}
		await this.update({ ...user, newPasswordRequest })

		return new Promise(resolve => resolve(newPasswordRequest))
	}

	async setNewPassword( token: string, password: string ): Promise<void> {
		const user: User = await this.repository.getByNewPasswordRequestToken(token)
		if ( !user ) {
			throw ('NO USER FOUND')
		}

		if ( !user.newPasswordRequest ) {
			throw('LOGICALLY IMPOSSIBLE ERROR ;)')
		}

		if ( moment(user.newPasswordRequest.validUntil).isBefore() ) {
			throw ('TOKEN EXPIRED')
		}

		try {
			const hash: string = await new Promise(( resolve, reject ) => {
				passwordHashAndSalt(password).hash(( err, hash ) => {
					if ( err ) {
						reject(err)
					} else {
						resolve(hash)
					}
				})
			})

			const changedUser = {
				...user,
				newPasswordRequest: null,
				hash,
			}

			return this.update(changedUser)
		} catch ( e ) {
			throw ('CANNOT ENCRYPT PASSWORD')
		}
	}

	async removeInvalidRequestNewPasswordToken(): Promise<void> {
		return this.repository.removeInvalidRequestNewPasswordToken()
	}

	async removeUnconfirmedLocalSignUps(): Promise<void> {
		return this.repository.removeUnconfirmedLocalSignUps()
	}

	async activateLocalUser( user: User ): Promise<User> {
		const savedUser: User = await this.repository.update(user)
		const mailQueueService = new MailQueueService()

		const serverConfig: ServerConfig | null = await ServerConfigService.getConfig()

		if ( serverConfig === null ) {
			throw ('NO SERVER CONFIG FOUND')
		}

		const mailServerService = new MailServerService()
		const mailServers = await mailServerService.getAll()
		const mailServer = mailServers.length > 0
			? mailServers[0]
			: null

		if ( mailServer ) {

			const mail: MailQueue = {
				createdAt: moment.utc(),
				// @ts-ignore
				mailServerId: mailServer._id,
				to: [user.mail, 'guido.drahota@deutschebahn.com'],
				subject: 'Ihre Registrierung bei Desk Sharing',
				content: `Ihr benutzerkonto bei Desk Sharing
<br/><br/>
Ihr Benutzerkonto wurde aktiviert.
<br/><br/>
Soe können sich ab sofort mit Ihrem Benutzernamen (${ savedUser.accountName }) auf ${ serverConfig.hostName } anmelden.
<br/><br/><br/>
Desk Sharing
`
			}
			await mailQueueService.add(mail)

			// @ts-ignore
			return this.getById(user._id)
		} else {
			throw Error('NO MAIL SERVER CONFIGURED')
		}
	}
}
