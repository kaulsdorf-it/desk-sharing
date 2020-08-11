import { getShareableUnitModel, ShareableUnit } from '../db-schemas/shareable-units'

export class ShareableUnitRepository {
	private model = getShareableUnitModel()

	async getAll(): Promise<ShareableUnit[]> {
		return this.model.find().lean()
	}

	async getById( _id: string ): Promise<ShareableUnit | null> {
		return this.model.findOne({ _id }).lean()
	}

	async getByRoomId( roomId: string ): Promise<ShareableUnit[]> {
		return this.model.find({ roomId }).lean()
	}

	async add( shareableUnit: ShareableUnit ): Promise<ShareableUnit> {
		return this.model.create(shareableUnit)
	}

	async update( shareableUnit: ShareableUnit ): Promise<ShareableUnit> {
		// @ts-ignore
		await this.model.update({ _id: shareableUnit._id }, shareableUnit)
		// @ts-ignore
		return this.getById(shareableUnit._id)
	}

	remove( _id: string ) {
		return this.model.deleteOne({ _id })
	}
}
