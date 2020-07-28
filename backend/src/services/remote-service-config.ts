import { RemoteServiceConfigRepository } from '../repositories/remote-service-config'
import { RemoteServiceConfig } from '../db-schemas/remote-services-config'

export class RemoteServiceConfigService {
	private readonly repository = new RemoteServiceConfigRepository()

	async getAll(): Promise<RemoteServiceConfig[]> {
		return this.repository.getAll()
	}

	async getByName( name: string ): Promise<RemoteServiceConfig> {
		return this.repository.getByName(name)
	}

	async add( config: RemoteServiceConfig ): Promise<RemoteServiceConfig> {
		return this.repository.add(config)
	}

	async updateByName( config: RemoteServiceConfig ): Promise<void> {
		return this.repository.updateByName(config)
	}
}
