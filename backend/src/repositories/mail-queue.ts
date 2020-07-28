import { getMailQueueModel, MailQueue } from '../db-schemas/mail-queue'

export class MailQueueRepository {
	private repository = getMailQueueModel()

	async getNextUnsent(): Promise<MailQueue[]> {
		const query = {
			messageId: {
				$exists: false
			},
			$or: [
				{ attemptsToSend: { $exists: false } },
				{ attemptsToSend: { $lt: 20 } },
			]
		}

		const sort = { attemptsToSend: 1 }

		return this.repository.find(query).sort(sort).lean()
	}

	async getById( _id: String ): Promise<MailQueue | null> {
		return this.repository.findOne({ _id }).lean()
	}

	async add( mail: MailQueue ) {
		return this.repository.create(mail)
	}

	async addMessageId( _id: string, messageId: string ) {
		return this.repository.updateOne({ _id }, { $set: { messageId } }).lean()
	}

	async update( mail: MailQueue ) {
		// @ts-ignore
		return this.repository.updateOne({ _id: mail._id }, mail, { upsert: false, new: false }).lean()
	}
}
