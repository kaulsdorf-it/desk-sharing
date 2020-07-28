import { arrayProp, getModelForClass, modelOptions, prop, setGlobalOptions } from '@typegoose/typegoose'
import Moment from 'moment'
import { AuthProvider } from './auth-providers'

setGlobalOptions({
	globalOptions: {
		useNewEnum: true,
	},
})

@modelOptions({ schemaOptions: { collection: 'server-configs' } })
export class ServerConfig {
	@prop({ required: true })
	hostName!: string

	@arrayProp({ required: true, type: AuthProvider })
	authProviders!: AuthProvider[]

	@prop({ required: false })
	lastUpdated?: Moment.Moment
}

export const getServerConfigModel = () => getModelForClass(ServerConfig)
