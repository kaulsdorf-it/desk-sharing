import { RoomRepository } from "../repositories/rooms"
import { Room } from '../db-schemas/rooms'

export class RoomService {
	private readonly repository

	constructor() {
		this.repository = new RoomRepository()
	}

	async getAll(): Promise<Room[]> {
		return this.repository.getAll()
	}

	async getById( id: string ): Promise<Room> {
		return this.repository.getById(id)
	}

	async getByBuildingId( roomId: string ): Promise<Room[]> {
		return this.repository.getByBuildingId(roomId)
	}

	async add( room: Room ): Promise<Room> {
		const item = await this.repository.add(room)
		return this.getById(item._id)
	}

	async update( room: Room ): Promise<Room> {
		return this.repository.update(room)
	}

	async remove( roomId: string ): Promise<Room> {
		return this.repository.remove(roomId)
	}
}
