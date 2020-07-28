import { prop } from '@typegoose/typegoose'

export class AuthSaml2Idp {
	@prop({ required: true })
	name!: string

	@prop({ required: true })
	host!: string

	@prop({ required: true })
	port!: number
}
