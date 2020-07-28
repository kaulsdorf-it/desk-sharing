import { getServerConfigModel, ServerConfig } from '../db-schemas/server-config'

export class ServerConfigRepository {
	private repo = getServerConfigModel()

	async getConfig(): Promise<ServerConfig | null> {
		return this.repo.findOne().lean()
	}

	async add( config: ServerConfig ): Promise<ServerConfig> {
		return this.repo.create(config)
	}
}
