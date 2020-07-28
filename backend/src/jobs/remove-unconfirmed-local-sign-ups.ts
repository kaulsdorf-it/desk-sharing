import { UserService } from '../services/user'

export const removeUnconfirmedLocalSignUps = async (): Promise<void> => {
	const userService = new UserService()
	return userService.removeUnconfirmedLocalSignUps()
}
