import { MailQueueRepository } from "../repositories/mail-queue"
import { MailQueue } from '../db-schemas/mail-queue'

export class MailQueueService {
	private readonly repository

	constructor() {
		this.repository = new MailQueueRepository()
	}

	async getNextUnsent(): Promise<MailQueue[]> {
		return this.repository.getNextUnsent()
	}

	async getById( id: string ): Promise<MailQueue> {
		return this.repository.getById(id)
	}

	async add( mail: MailQueue ): Promise<void> {
		this.repository.add(mail)
	}

	async addMessageId( id: string, messageId: string ): Promise<void> {
		this.repository.addMessageId(id, messageId)
	}

	async update( mail: MailQueue ): Promise<MailQueue> {
		return this.repository.update(mail)
	}
}
