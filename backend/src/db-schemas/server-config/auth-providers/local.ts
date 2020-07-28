import { prop } from '@typegoose/typegoose'

export class AuthLocal {
	@prop({ required: true })
	name!: string

	@prop({ required: true })
	url!: string

	@prop({ required: true })
	passwordExpiresInDays!: number

	@prop({ required: true })
	anonymizeAccountOnInactivityAfterDays!: number
}
