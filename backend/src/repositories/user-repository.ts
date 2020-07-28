import { getUserModel, User } from '../db-schemas/users'

export class UserRepository {
	private model

	constructor() {
		this.model = getUserModel()
	}

	public async getUserByAccountName( accountName: string ): Promise<User> {
		return this.model.findOne({ accountName: accountName }).lean()
	}

	public async create( user: User ): Promise<User> {
		return this.model.create(user)
	}

	public async getByClientId( clientId: string ): Promise<User> {
		const query = { clientIds: clientId }
		return this.model.findOne(query)
	}

	public async update( user: User ): Promise<User> {
		// @ts-ignore
		await this.model.updateOne({ _id: user._id }, user)
		// @ts-ignore
		return this.model.findOne({ _id: user._id }).lean()
	}
}
