import { MailServerRepository } from '../repositories/mail-servers'
import { MailServer } from "../db-schemas/mail-servers"

export class MailServerService {
	private readonly repository = new MailServerRepository()

	async getAll(): Promise<MailServer[]> {
		return this.repository.getAll()
	}

	async getById( id: string ): Promise<MailServer | null> {
		return this.repository.getById(id)
	}

	async add( mailServer: MailServer ): Promise<MailServer> {
		return this.repository.add(mailServer)
	}

	async update( mailServer: MailServer ): Promise<MailServer> {
		await this.repository.update(mailServer)
		// @ts-ignore
		return this.getById(mailServer._id)
	}

	async remove( id: string ) {
		const result = await this.repository.remove(id)
		if ( result.deletedCount === 1 ) {
			return id
		} else {
			throw Error('DOCUMENT NOT FOUND')
		}
	}
}
