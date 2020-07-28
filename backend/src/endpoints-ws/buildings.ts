import { BuildingService } from '../services/buildings'
import { Building } from '../db-schemas/buildings'

export const registerBuildingEndpoints = ( io, socket ): void => {
	const buildingService = new BuildingService()

	const getAll = async (): Promise<void> => {
		try {
			const items: Building[] = await buildingService.getAll()
			socket.emit('get_all_buildings__success', items)
		} catch ( e ) {
			socket.emit('get_all_buildings__failed', e)
		}
	}

	const getById = async ( buildingId: string ): Promise<void> => {
		try {
			const item: Building = await buildingService.getById(buildingId)
			socket.emit('get_building_by_id__success', item)
		} catch ( e ) {
			socket.emit('get_building_by_id__failed', e)
		}
	}

	const add = async ( building: Building ): Promise<void> => {
		try {
			const storedBuilding: Building = await buildingService.add(building)
			io.emit('update_building__success', storedBuilding)
		} catch ( e ) {
			socket.emit('add_building__failed', e)
		}
	}

	const update = async ( building: Building ): Promise<void> => {
		try {
			const storedBuilding: Building = await buildingService.update(building)
			io.emit('update_building__success', storedBuilding)
		} catch ( e ) {
			socket.emit('update_building__failed', e)
		}
	}

	const remove = async ( buildingId: string ): Promise<void> => {
		try {
			await buildingService.remove(buildingId)
			io.emit('remove_building__success', buildingId)
		} catch ( e ) {
			socket.emit('remove_building__failed', e)
		}
	}

	socket
		.on('get-all-buildings', getAll)
		.on('get-building-by-id', getById)
		.on('add-building', add)
		.on('update-building', update)
		.on('remove-building', remove)
}
