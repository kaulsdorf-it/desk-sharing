import { RoomService } from '../services/rooms'
import { Room } from '../db-schemas/rooms'

export const registerRoomEndpoints = ( io, socket ): void => {
	const roomService = new RoomService()

	const getAll = async (): Promise<void> => {
		try {
			const items: Room[] = await roomService.getAll()
			socket.emit('get_all_buildings__success', items)
		} catch ( e ) {
			socket.emit('get_all_buildings__failed', e)
		}
	}

	const getById = async ( roomIdId: string ): Promise<void> => {
		try {
			const item: Room = await roomService.getById(roomIdId)
			socket.emit('get_room_by_id__success', item)
		} catch ( e ) {
			socket.emit('get_room_by_id__failed', e)
		}
	}

	const getByBuildingId = async ( buildingId: string ): Promise<void> => {
		try {
			const items: Room[] = await roomService.getByBuildingId(buildingId)
			socket.emit('get_rooms_by_building_id__success', items)
		} catch ( e ) {
			socket.emit('get_rooms_by_building_id__failed', e)
		}
	}

	const add = async ( room: Room ): Promise<void> => {
		try {
			const storedRoom: Room = await roomService.add(room)
			io.emit('update_room__success', storedRoom)
		} catch ( e ) {
			socket.emit('add_room__failed', e)
		}
	}

	const update = async ( room: Room ): Promise<void> => {
		try {
			const storedRoom: Room = await roomService.update(room)
			io.emit('update_room__success', storedRoom)
		} catch ( e ) {
			socket.emit('update_room__failed', e)
		}
	}

	const remove = async ( buildingId: string ): Promise<void> => {
		try {
			await roomService.remove(buildingId)
			io.emit('remove_room__success', buildingId)
		} catch ( e ) {
			socket.emit('remove_room__failed', e)
		}
	}

	socket
		.on('get-all-rooms', getAll)
		.on('get-room-by-id', getById)
		.on('get-rooms-by-building-id', getByBuildingId)
		.on('add-room', add)
		.on('update-room', update)
		.on('remove-room', remove)
}
