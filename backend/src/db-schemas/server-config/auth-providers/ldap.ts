import { prop } from '@typegoose/typegoose'

export class Credentials {
	@prop({ default: '' })
	user!: string

	@prop({ default: '' })
	password!: string
}

export class AuthLdap {
	@prop({ required: true })
	name!: string

	@prop({ required: true })
	url!: string

	@prop({ required: true })
	port!: number

	@prop({ required: true })
	baseDN!: string

	@prop({ required: true })
	userDN!: string

	@prop({ required: true })
	credentials!: Credentials
}
