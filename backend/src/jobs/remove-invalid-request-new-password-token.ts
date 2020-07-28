import { UserService } from '../services/user'

export const removeInvalidRequestNewPasswordToken = async (): Promise<void> => {
	const userService = new UserService()
	return userService.removeInvalidRequestNewPasswordToken()
}
