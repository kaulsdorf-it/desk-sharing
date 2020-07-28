import { ServerConfigRepository } from '../repositories/server-config'
import { ServerConfig } from '../db-schemas/server-config'
import { emit } from '../message-bus'

export class ServerConfigService {
	private static repository = new ServerConfigRepository()

	public static async getConfig(): Promise<ServerConfig | null> {
		return this.repository.getConfig()
	}

	public static async add( config: ServerConfig ): Promise<ServerConfig | null> {
		await this.repository.add(config)
		emit('loadConfigFromRegistry')
		return this.repository.getConfig()
	}
}
