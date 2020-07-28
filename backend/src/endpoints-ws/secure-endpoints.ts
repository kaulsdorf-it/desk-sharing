import { UserService } from "../services/user"
import { EnumUserRole } from '../db-schemas/users'

const userService = new UserService()

export const checkEndpoint = async ( socket: any, endpointType: string ): Promise<boolean> => {
	switch ( endpointType.toLowerCase() ) {
		case 'add-form':
		case 'update-form':
		case 'remove-form':
		case 'add-form-element':
		case 'update-form-elements':
			return userService.hasUserRole(socket, EnumUserRole.FORM_DESIGNER)

		case 'set-form-stage':
		case 'add-mail-to-form':
		case 'update-mail-to-form':
		case 'remove-mail-from-form':
		case 'update-form-conditional-fields':
		case 'add-additional-info-group-to-form':
		case 'update-additional-info-groups-in-form':
		case 'update-form-name-description-need-approval':
			return userService.hasUserRole(socket, EnumUserRole.FORM_STAGE_MANAGER)

		case 'update-user':
		case 'get-user-roles':
		case 'add-form-domain':
		case 'update-form-domain':
		case 'add-admin-user-to-form-domain':
		case 'remove-admin-user-from-form-domain':
		case 'update-form-domain-name':
		case 'update-form-domain-description':
		case 'delete-form-domain':
			return userService.hasUserRole(socket, EnumUserRole.ADMIN)

		default:
			return new Promise(resolve => resolve(true))
	}
}
