import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import { Moment } from 'moment'
import mongoose from 'mongoose'

@modelOptions({ schemaOptions: { collection: 'FileUploads' } })
export class FileUpload {
	@prop({ required: true })
	_id!: mongoose.Schema.Types.ObjectId

	@prop({ required: true })
	name!: string

	@prop({ required: true })
	ownerId!: string

	@prop({ required: true })
	filledFormId!: string

	@prop({ required: true })
	originalFileName!: string

	@prop({ required: true })
	uploadDir!: string

	@prop({ required: true })
	uploaded!: Moment

	@prop({ required: true })
	size!: number

	@prop({ required: true })
	mime!: string
}

export const getFileUploadModel = () => getModelForClass(FileUpload)
