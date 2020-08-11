import { ShareableUnit } from '../db-schemas/shareable-units'
import { ShareableUnitService } from '../services/shareable-units'
import { ShareableUnitBookingService } from '../services/shareable-unit-bookings'

export const registerShareableUnitsEndpoints = ( io, socket ): void => {
	const shareableUnitService = new ShareableUnitService()
	const shareableUnitBookingService = new ShareableUnitBookingService()

	const getAll = async (): Promise<void> => {
		try {
			const items: ShareableUnit[] = await shareableUnitService.getAll()
			socket.emit('get_all_shareable_units__success', items)
		} catch ( e ) {
			socket.emit('get_all_shareable_units__failed', e)
		}
	}

	const getById = async ( buildingId: string ): Promise<void> => {
		try {
			const item: ShareableUnit | null = await shareableUnitService.getById(buildingId)
			socket.emit('get_shareable_unit_by_id__success', item)
		} catch ( e ) {
			socket.emit('get_shareable_unit_by_id__failed', e)
		}
	}

	const add = async ( shareableUnit: ShareableUnit ): Promise<void> => {
		try {
			const storedShareableUnit: ShareableUnit = await shareableUnitService.add(shareableUnit)
			io.emit('update_shareable_unit__success', storedShareableUnit)
		} catch ( e ) {
			socket.emit('add_shareable_unit__failed', e)
		}
	}

	const update = async ( shareableUnit: ShareableUnit ): Promise<void> => {
		try {
			const storedBuilding: ShareableUnit = await shareableUnitService.update(shareableUnit)
			io.emit('update_shareable_unit__success', storedBuilding)
		} catch ( e ) {
			socket.emit('update_shareable_unit__failed', e)
		}
	}

	const remove = async ( itemId: string ): Promise<void> => {
		try {
			const { deletedCount } = await shareableUnitService.remove(itemId)

			if ( deletedCount === 1 ) {
				io.emit('remove_shareable_unit__success', itemId)
			} else {
				socket.emit('remove_shareable_unit__failed')
			}
		} catch ( e ) {
			socket.emit('remove_shareable_unit__failed', e)
		}
	}

	socket
		.on('get-all-shareable-units', getAll)
		.on('get-shareable-unit-by-id', getById)
		.on('add-shareable-unit', add)
		.on('update-shareable-unit', update)
		.on('remove-shareable-unit', remove)
}
