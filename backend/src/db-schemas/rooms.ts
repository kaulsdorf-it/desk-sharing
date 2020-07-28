import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { collection: 'rooms' } })
export class Room {
	@prop({ required: true })
	name!: string

	@prop({ required: true })
	buildingId!: string
}

export const getRoomModel = () => getModelForClass(Room)
