import { io } from '../infrastructure/websocket'
import { registerClientEndpoints } from './users'
import { registerUtilsEndpoints } from './utils'
import { registerServerConfigEndpoints } from './server-config'
import { registerLocalAuthProviderEndpoints } from './auth-providers/local'
import { registerMailServerEndpoints } from './mail-servers'
import { registerBuildingEndpoints } from './buildings'
import { registerRoomEndpoints } from './rooms'
import { registerShareableUnitsEndpoints } from './shareable-units'
import { registerShareableUnitBookingsEndpoints } from './shareable-unit-bookings'

export const registerWebSocketEndpoints = () => {
	io
		.on('connect', async socket => {
			registerServerConfigEndpoints(io, socket)

			registerClientEndpoints(io, socket)

			registerUtilsEndpoints(io, socket)

			registerLocalAuthProviderEndpoints(io, socket)

			registerMailServerEndpoints(io, socket)

			registerBuildingEndpoints(io, socket)
			registerRoomEndpoints(io, socket)
			registerShareableUnitsEndpoints(io, socket)
			registerShareableUnitBookingsEndpoints(io, socket)
		})

		.on('reconnect', () => {
			console.log('reconnect')
		})

		.on('disconnect', reason => {
			if ( reason === 'io server disconnect' ) {
				// the disconnection was initiated by the server, need to reconnect manually
			}

			// else the socket will automatically try to reconnect
			console.log('webSocket disconnected', reason)
		})

		.on('connect_error', err => {
			console.log('connect_error', err)
		})
}
