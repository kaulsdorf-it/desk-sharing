import { FileUpload, getFileUploadModel } from '../db-schemas/file-uploads'

export class FileUploadRepository {
	private readonly model = getFileUploadModel()

	async getAll(): Promise<FileUpload[]> {
		return this.model.find().lean()
	}

	async getById( _id: String ): Promise<FileUpload | null> {
		return this.model.findOne({ _id }).lean()
	}

	add( item: FileUpload ) {
		return this.model.create(item)
	}

	update( item: FileUpload ) {
		// @ts-ignore
		return this.model.updateOne({ _id: item._id }, item, { upsert: false, new: true })
	}

	remove( _id: string ) {
		return this.model.remove({ _id })
	}

	findByOwnerAndFilledFormId( filledFormId: string, fileName: string ) {
		const query = {
			name: `${ filledFormId }/${ fileName }`,
		}

		return this.model.findOne(query).lean()
	}
}
