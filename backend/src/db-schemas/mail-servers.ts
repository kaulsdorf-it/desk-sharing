import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

class Auth {
	@prop({ default: "" })
	user?: string

	@prop({ default: "" })
	pass?: string
}

class From {
	@prop({ required: true })
	mail!: string

	@prop({ required: true })
	name!: string
}

@modelOptions({ schemaOptions: { collection: 'MailServers' } })
export class MailServer {
	@prop({ required: true })
	name!: string

	@prop({ required: true })
	host!: string

	@prop({ required: true })
	port!: number

	@prop({ default: false })
	secure?: boolean

	@prop({ required: false })
	auth?: Auth

	@prop({ required: true })
	from?: From
}

export const getMailServerModel = () => getModelForClass(MailServer)
