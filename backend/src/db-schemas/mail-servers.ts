import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

class Auth {
	@prop({ required: true })
	user!: string

	@prop({ required: true })
	pass!: string
}

class From {
	@prop({ required: true })
	mail!: string

	@prop({ required: false })
	name?: string
}

@modelOptions({ schemaOptions: { collection: 'MailServers' } })
export class MailServer {
	@prop({ required: true })
	name!: string

	@prop({ required: true })
	host!: string

	@prop({ required: true })
	port!: number

	@prop({ required: true })
	secure!: boolean

	@prop({ required: false })
	auth!: Auth

	@prop({ required: true })
	from!: From
}

export const getMailServerModel = () => getModelForClass(MailServer)
