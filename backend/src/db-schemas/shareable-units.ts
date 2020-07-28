import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { collection: 'shareable-units' } })
export class ShareableUnit {
	@prop({ required: true })
	name!: string

	@prop({ required: true })
	roomId!: string
}

export const getShareableUnitModel = () => getModelForClass(ShareableUnit)
