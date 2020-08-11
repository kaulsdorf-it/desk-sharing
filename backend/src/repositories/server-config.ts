import { getServerConfigModel, ServerConfig } from '../db-schemas/server-config'

export class ServerConfigRepository {
	private model = getServerConfigModel()

	async getConfig(): Promise<ServerConfig | null> {
		return this.model.findOne().lean()
	}

	async add( config: ServerConfig ): Promise<ServerConfig> {
		return this.model.create(config)
	}

	update( serverConfig: ServerConfig ) {
		// @ts-ignore
		return this.model.updateOne({ _id: serverConfig._id }, serverConfig)
	}
}
