import { BuildingRepository } from "../repositories/buildings"
import { Building } from '../db-schemas/buildings'

export class BuildingService {
	private readonly repository

	constructor() {
		this.repository = new BuildingRepository()
	}

	async getAll(): Promise<Building[]> {
		return this.repository.getAll()
	}

	async getById( id: string ): Promise<Building> {
		return this.repository.getById(id)
	}

	async add( building: Building ): Promise<Building> {
		const response = await this.repository.add(building)
		return this.getById(response._id)
	}

	async update( building: Building ): Promise<Building> {
		return this.repository.update(building)
	}

	async remove( buildingId: string ): Promise<Building> {
		return this.repository.remove(buildingId)
	}
}
