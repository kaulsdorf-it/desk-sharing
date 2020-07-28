import { arrayProp, getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import Moment from 'moment'

export class Attachment {
	@prop({ required: false })
	filename!: string

	@prop({ required: false })
	content?: string

	@prop({ required: false })
	path?: string

	@prop({ required: false })
	contentType?: string
}


@modelOptions({ schemaOptions: { collection: 'MailQueue' } })
export class MailQueue {
	@prop({ required: false })
	createdAt?: Moment.Moment

	@prop({ required: true })
	mailServerId!: string

	@prop({ required: false })
	from?: string

	@arrayProp({ required: true, type: String })
	to!: string[]

	@arrayProp({ required: false, type: String })
	cc?: string[]

	@arrayProp({ required: false, type: String })
	bcc?: string[]

	@prop({ required: true, type: String })
	subject!: string

	@prop({ required: true })
	content!: string

	@arrayProp({ default: [], type: Attachment, _id: false })
	attachments?: Attachment[]

	@prop({ required: false })
	messageId?: string

	@prop({ default: 0, required: false })
	attemptsToSend?: number
}

export const getMailQueueModel = () => getModelForClass(MailQueue)
