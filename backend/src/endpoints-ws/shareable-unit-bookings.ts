import { ShareableUnitBooking } from '../db-schemas/shareable-unit-bookings'
import { ShareableUnitBookingService } from '../services/shareable-unit-bookings'
import { ShareableUnitService } from '../services/shareable-units'

export const registerShareableUnitBookingsEndpoints = ( io, socket ): void => {
	const shareableUnitBookingService = new ShareableUnitBookingService()
	const shareableUnitService = new ShareableUnitService()

	const getByRoomId = async ( roomId: string ): Promise<void> => {
		try {
			const bookings: ShareableUnitBooking[] = await shareableUnitBookingService.getByRoomId(roomId)
			socket.emit('get_shareable_unit_bookings_by_room_id__success', { roomId, bookings })
		} catch ( e ) {
			socket.emit('get_shareable_unit_bookings_by_room_id__failed', e)
		}
	}

	const addBooking = async ( booking: ShareableUnitBooking ): Promise<void> => {
		try {
			const storedBooking: ShareableUnitBooking | null = await shareableUnitBookingService.add({ ...booking, userId: socket.userId })

			if ( storedBooking ) {
				const shareableUnit = await shareableUnitService.getById(storedBooking.shareableUnitId)
				io.emit('update_shareable_unit_booking__success', { booking: storedBooking, roomId: shareableUnit.roomId })
			}
		} catch ( e ) {
			socket.emit('add_shareable_unit_booking__failed', e)
		}
	}

	const update = async ( booking: ShareableUnitBooking ): Promise<void> => {
		try {
			const storedBuilding: ShareableUnitBooking = await shareableUnitBookingService.update(booking)
			io.emit('update_shareable_unit_booking__success', storedBuilding)
		} catch ( e ) {
			socket.emit('update_shareable_unit_booking__failed', e)
		}
	}

	const cancel = async ( { bookingId, date, roomId } ): Promise<void> => {
		try {
			await shareableUnitBookingService.remove(bookingId)
			io.emit('cancel_shareable_unit_booking__success', { bookingId, date, roomId })
		} catch ( e ) {
			console.log('ERROR in cancel()', e)
			socket.emit('remove_shareable_unit_booking__failed', e)
		}
	}

	socket
		.on('get-shareable-unit-bookings-by-room-id', getByRoomId)
		.on('add-shareable-unit-booking', addBooking)
		.on('update-shareable-unit-booking', update)
		.on('cancel-shareable-unit-booking', cancel)
}
