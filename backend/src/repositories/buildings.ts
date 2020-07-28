import { Building, getBuildingModel } from '../db-schemas/buildings'

export class BuildingRepository {
	private model = getBuildingModel()

	async getAll(): Promise<Building[]> {
		return this.model.find().lean()
	}

	async getById( _id: string ): Promise<Building | null> {
		return this.model.findOne({ _id }).lean()
	}

	async add( building: Building ): Promise<Building> {
		return this.model.create(building)
	}

	async update( building: Building ): Promise<Building> {
		// @ts-ignore
		await this.model.update({ _id: building._id }, building)
		// @ts-ignore
		return this.getById(building._id)
	}

	async remove( _id: string ): Promise<void> {
		this.model.remove({ _id })
	}
}
