import { getMailServerModel, MailServer } from "../db-schemas/mail-servers"

export class MailServerRepository {
	private model = getMailServerModel()

	async getAll(): Promise<MailServer[]> {
		return this.model.find()
	}

	async getById( _id: string ): Promise<MailServer | null> {
		return this.model.findOne({ _id })
	}

	async add( mailServer: MailServer ): Promise<MailServer> {
		return this.model.create(mailServer)
	}

	async remove( _id: string ): Promise<any> {
		return this.model.remove({ _id })
	}

	async update( mailServer: MailServer ): Promise<any> {
		// @ts-ignore
		return this.model.updateOne({ _id: mailServer._id }, mailServer)
	}
}
