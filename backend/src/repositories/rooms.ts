import { getRoomModel, Room } from '../db-schemas/rooms'

export class RoomRepository {
	private model = getRoomModel()

	async getAll(): Promise<Room[]> {
		return this.model.find().lean()
	}

	async getById( _id: string ): Promise<Room | null> {
		return this.model.findOne({ _id }).lean()
	}

	async getByBuildingId( buildingId: string ): Promise<Room[]> {
		return this.model.find({ buildingId }).lean()
	}

	async add( room: Room ): Promise<Room> {
		return this.model.create(room)
	}

	async update( room: Room ): Promise<Room> {
		// @ts-ignore
		await this.model.update({ _id: room._id }, room)
		// @ts-ignore
		return this.getById(room._id)
	}

	async remove( _id: string ): Promise<void> {
		this.model.remove({ _id })
	}
}
