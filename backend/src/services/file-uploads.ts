import { FileUploadRepository } from '../repositories/file-uploads'
import { FileUpload } from '../db-schemas/file-uploads'

export class FileUploadService {
	private readonly repository = new FileUploadRepository()

	async add( item: FileUpload ): Promise<FileUpload> {
		return this.repository.add(item)
	}

	async findByOwnerAndFilledFormId( filledFormId: string, fileName: string ): Promise<FileUpload> {
		return this.repository.findByOwnerAndFilledFormId(filledFormId, fileName)
	}
}
