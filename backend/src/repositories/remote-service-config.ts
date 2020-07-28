import { getRemoteServiceConfigModel, RemoteServiceConfig } from '../db-schemas/remote-services-config'

export class RemoteServiceConfigRepository {
	private readonly model

	constructor() {
		this.model = getRemoteServiceConfigModel()
	}

	async getAll(): Promise<RemoteServiceConfig[]> {
		return this.model.find()
	}

	async getByName( serviceName: string ): Promise<RemoteServiceConfig> {
		return this.model.findOne({ serviceName })
	}

	async add( config: RemoteServiceConfig ): Promise<RemoteServiceConfig> {
		return this.model.create(config)
	}

	async updateByName( config: RemoteServiceConfig ) {
		const saved = await this.getByName(config.serviceName)

		if ( saved ) {
			const update = {
				params: config.params
			}
			return this.model.updateOne({ serviceName: config.serviceName }, update)
		} else {
			return this.add({
				serviceName: config.serviceName,
				params: config.params,
			})
		}
	}
}
