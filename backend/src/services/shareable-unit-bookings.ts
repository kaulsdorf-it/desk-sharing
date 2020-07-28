import { ShareableUnitBookingRepository } from '../repositories/shareable-unit-bookings'
import { ShareableUnitBooking } from '../db-schemas/shareable-unit-bookings'
import { ShareableUnitService } from './shareable-units'

export class ShareableUnitBookingService {
	private readonly repository = new ShareableUnitBookingRepository()
	private readonly shareableUnitService = new ShareableUnitService()

	async getByRoomId( roomId: string ) {
		const shareableUnits = await this.shareableUnitService.getByRoomId(roomId)
		// @ts-ignore
		const promises = shareableUnits.map(su => this.repository.getByShareableUnitId(su._id))
		const bookings = await Promise.all(promises)

		// @ts-ignore
		return bookings.flat(1).filter(i => i)
	}

	async getByUserId( userId: string ) {
		return this.repository.getByUserId(userId)
	}

	async add( shareableUnitBooking: ShareableUnitBooking ): Promise<ShareableUnitBooking | null> {
		const item: ShareableUnitBooking = await this.repository.add(shareableUnitBooking)

		// @ts-ignore
		return this.repository.getById(item._id)
	}

	async update( shareableUnitBooking: ShareableUnitBooking ): Promise<ShareableUnitBooking> {
		return this.repository.update(shareableUnitBooking)
	}

	// async remove( shareableUnitBookingId: string ): Promise<ShareableUnitBooking> {
	// 	return this.repository.remove(shareableUnitBookingId)
	// }
}
