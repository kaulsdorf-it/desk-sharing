import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { collection: 'shareable-unit-bookings' } })
export class ShareableUnitBooking {
	@prop({ required: true })
	shareableUnitId!: string

	@prop({ required: true })
	date!: string

	@prop({ required: true })
	timeFrom!: string

	@prop({ required: true })
	timeTill!: string

	@prop({ required: true })
	userId!: string
}

export const getShareableUnitBookingModel = () => getModelForClass(ShareableUnitBooking)
