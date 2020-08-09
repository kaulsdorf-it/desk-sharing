import { UserService } from "../services/user"
import { EnumUserRole } from '../db-schemas/users'

const userService = new UserService()

export const checkEndpoint = async ( socket: any, endpointType: string ): Promise<boolean> => {
	switch ( endpointType.toLowerCase() ) {
		case 'update-user':
			return userService.hasUserRole(socket, EnumUserRole.ADMIN)

		default:
			return new Promise(resolve => resolve(true))
	}
}
