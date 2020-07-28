import axiosLib, { AxiosInstance } from 'axios'

export interface IConfig {
	baseUrl: string,
	timeout: number,

	[key: string]: any
}

export class DefaultAdapter {
	protected config: IConfig
	private readonly axios: AxiosInstance

	constructor( config: IConfig ) {
		this.config = config
		this.axios = axiosLib.create(config)
	}

	protected get( url: string ): Promise<any> {
		return this.restCall('get', url)
	}

	protected post( url: string, payload: any ): Promise<any> {
		return this.restCall('post', url, payload)
	}

	protected put( url: string, payload: any ): Promise<any> {
		return this.restCall('put', url, payload)
	}

	protected delete( url: string ): Promise<any> {
		return this.restCall('delete', url)
	}

	private async restCall( method: string, url: string, payload?: any ) {
		try {
			const { data } = await this.axios[method](url, payload)
			return data
		} catch ( e ) {
			throw e
		}
	}
}
