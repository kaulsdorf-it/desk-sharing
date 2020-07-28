import { ShareableUnitRepository } from '../repositories/shareable-units'
import { ShareableUnit } from '../db-schemas/shareable-units'

export class ShareableUnitService {
	private readonly repository

	constructor() {
		this.repository = new ShareableUnitRepository()
	}

	async getAll(): Promise<ShareableUnit[]> {
		return this.repository.getAll()
	}

	async getById( id: string ): Promise<ShareableUnit> {
		return this.repository.getById(id)
	}

	async getByRoomId( roomId: string ): Promise<ShareableUnit[]> {
		return this.repository.getByRoomId(roomId)
	}

	async getBookedShareableUnits( roomId: string, date: string ) {
		return this.repository.getByRoomId(roomId)
	}

	async add( shareableUnit: ShareableUnit ): Promise<ShareableUnit> {
		const item = await this.repository.add(shareableUnit)
		return this.getById(item._id)
	}

	async update( shareableUnit: ShareableUnit ): Promise<ShareableUnit> {
		return this.repository.update(shareableUnit)
	}

	async remove( shareableUnitId: string ): Promise<ShareableUnit> {
		return this.repository.remove(shareableUnitId)
	}
}
