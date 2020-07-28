import { getUserModel, User, UserStatus } from '../db-schemas/users'
import moment from 'moment'

export class UserRepository {
	private model

	constructor() {
		this.model = getUserModel()
	}

	async hasAnyUser(): Promise<boolean> {
		return this.model.countDocuments()
	}

	async getAll(): Promise<User[]> {
		return this.model.find()
	}

	async get( _id: string ): Promise<User> {
		const query = { _id }
		return this.model.findOne(query).lean()
	}

	async getByClientId( clientId: string ): Promise<User> {
		const query = { clientIds: clientId }
		return this.model.findOne(query).lean()
	}

	async getUserByAccountName( authProviderId: string, accountName: string ): Promise<User> {
		return this.model.findOne({ authProviderId, accountName })
	}

	async getByAuthProviderIdAndMail( authProviderId: string, mail: string ) {
		const query = { authProviderId, mail }
		return this.model.findOne(query).lean()
	}

	async getByNewPasswordRequestToken( token: string ): Promise<User> {
		const query = { 'newPasswordRequest.token': token }
		return this.model.findOne(query).lean()
	}

	async getByAccountName( authProviderId: string, accountName: string ): Promise<User> {
		const query = { authProviderId, accountName }
		return this.model.findOne(query).lean()
	}

	async create( user: User ): Promise<User> {
		return this.model.create(user)
	}

	async updateReferenceData( userId: string, referenceData: any ): Promise<User> {
		const query = { _id: userId }
		const update = {
			$set: {
				'userReferenceData.lastUpdated': moment.utc(),
				'userReferenceData.data': referenceData,
			}
		}

		await this.model.updateOne(query, update)
		// @ts-ignore
		return this.model.findOne({ _id: userId }).lean()
	}

	async update( user: User ): Promise<User | undefined> {
		try {
			// @ts-ignore
			await this.model.updateOne({ _id: user._id }, user)
			// @ts-ignore
			return this.get(user._id.toString())
		} catch ( e ) {
			console.error('ERROR in UserRepository.update()', e)
			return
		}
	}

	async delete( userId: string ): Promise<User | undefined> {
		const storedUser = await this.get(userId)
		storedUser.status = UserStatus.INACTIVE
		return this.update(storedUser)
	}

	async countAll(): Promise<number> {
		return this.model.countDocuments()
	}

	async removeInvalidRequestNewPasswordToken(): Promise<void> {
		const query = {
			'newPasswordRequest.validUntil': {
				$lt: moment.utc().valueOf()
			}
		}

		const update = { $unset: { newPasswordRequest: 1 } }
		return this.model.updateMany(query, update)
	}

	async removeUnconfirmedLocalSignUps(): Promise<void> {
		const query = {
			status: UserStatus.UNCONFIRMED,
			createdAt: {
				$lt: moment.utc().subtract(2, 'days').valueOf()
			}
		}

		return this.model.deleteMany(query)
	}
}
