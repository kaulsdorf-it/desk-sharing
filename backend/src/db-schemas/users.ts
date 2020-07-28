import { arrayProp, getModelForClass, index, modelOptions, prop } from '@typegoose/typegoose'
import Moment from 'moment'

export enum EnumUserRole {
	ADMIN = 'admin',
	FORM_STAGE_MANAGER = 'form-stage-manager',
	FORM_DESIGNER = 'form-designer'
}

export enum UserStatus {
	UNCONFIRMED = 'unconfirmed',
	CONFIRMED_BY_APPLICANT = 'confirmed by applicant',
	ACTIVE = 'active',
	INACTIVE = 'inactive',
}

export class NewPasswordRequest {
	@prop({ required: true })
	validUntil!: Moment.Moment

	@prop({ required: true })
	token!: string
}

@index({ accountName: 1, authProviderId: 1 }, { unique: true })
@index({ clientIds: 1 }, { sparse: true })
@modelOptions({ schemaOptions: { collection: 'Users' } })
export class User {
	@prop({ required: true })
	createdAt!: Moment.Moment

	@prop({ required: true })
	accountName!: string

	@prop({ enum: UserStatus, required: true, type: String })
	status!: UserStatus

	@prop({ required: true })
	firstName!: string

	@prop({ required: true })
	lastName!: string

	@prop({ required: true })
	mail!: string

	@prop({ required: false })
	hash?: string

	@prop({ required: true })
	authProviderId!: string

	@arrayProp({ required: true, enum: EnumUserRole, type: String })
	roles!: EnumUserRole[]

	@arrayProp({ required: false, type: String })
	clientIds?: string[]

	@prop({ required: false, type: NewPasswordRequest })
	newPasswordRequest?: NewPasswordRequest | null
}

export const getUserModel = () => getModelForClass(User)
