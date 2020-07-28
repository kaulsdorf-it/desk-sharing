import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { collection: 'buildings' } })
export class Building {
	@prop({ required: true })
	name!: string
}

export const getBuildingModel = () => getModelForClass(Building)
