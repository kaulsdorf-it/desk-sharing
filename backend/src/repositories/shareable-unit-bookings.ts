import { getShareableUnitBookingModel, ShareableUnitBooking } from '../db-schemas/shareable-unit-bookings'

export class ShareableUnitBookingRepository {
	private model = getShareableUnitBookingModel()

	async getAll(): Promise<ShareableUnitBooking[]> {
		return this.model.find().lean()
	}

	async getById( _id: string ): Promise<ShareableUnitBooking | null> {
		return this.model.findOne({ _id }).lean()
	}

	async getByUserId( userId: string ): Promise<ShareableUnitBooking[]> {
		return this.model.find({ userId }).lean()
	}

	async getByShareableUnitId( shareableUnitId: string ): Promise<any> {
		return this.model.find({ shareableUnitId })
	}

	async add( shareableUnit: ShareableUnitBooking ): Promise<ShareableUnitBooking> {
		return this.model.create(shareableUnit)
	}

	async update( shareableUnit: ShareableUnitBooking ): Promise<ShareableUnitBooking> {
		// @ts-ignore
		await this.model.update({ _id: shareableUnit._id }, shareableUnit)
		// @ts-ignore
		return this.getById(shareableUnit._id)
	}

	async remove( _id: string ): Promise<void> {
		this.model.remove({ _id })
	}
}
