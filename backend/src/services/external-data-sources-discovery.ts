import { DefaultAdapter } from '../adapter/default-adapter'

export class ExternalDataSourceDiscoveryService extends DefaultAdapter {
	constructor() {
		super({
			baseUrl: '',
			timeout: 10000,
		})
	}

	async getInfo( url ): Promise<any> {
		return this.get(url)
	}

	async search( url ): Promise<any> {
		return this.get(url)
	}
}
