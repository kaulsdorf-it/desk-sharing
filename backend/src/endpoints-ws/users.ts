import { IUserApplication, UserService } from '../services/user'
import { SignInService } from '../services/sign-in'
import { User } from '../db-schemas/users'
import { Salt } from '../infrastructure/websocket'
import jwt from 'jsonwebtoken'
import { ICredentials } from '../types'
import { MailServerService } from '../services/mail-servers'
import { BuildingService } from '../services/buildings'
import { RoomService } from '../services/rooms'
import { ShareableUnitService } from '../services/shareable-units'
import { ShareableUnitBooking } from "../db-schemas/shareable-unit-bookings"
import { ShareableUnitBookingService } from '../services/shareable-unit-bookings'
import { ServerConfigService } from "../services/server-config"

export const registerClientEndpoints = ( io, socket ): void => {
	const userService = new UserService()
	const mailServerService = new MailServerService()
	const buildingService = new BuildingService()
	const roomService = new RoomService()
	const shareableUnitService = new ShareableUnitService()
	const shareableUnitBookingService = new ShareableUnitBookingService()
	const serverConfigService = new ServerConfigService()

	const sendDataToUser = async ( socket, user ): Promise<void> => {
		// @ts-ignore
		socket.userId = user._id.toString()

		// @ts-ignore
		socket.join(user._id)

		socket.join('signed-in')

		const token = jwt.sign({ data: user._id }, Salt.getSalt(), { expiresIn: '12h' })
		socket.emit('authenticated', token)

		const buildings = await buildingService.getAll()
		socket.emit('get_all_buildings__success', buildings)

		const rooms = await roomService.getAll()
		socket.emit('get_all_rooms__success', rooms)

		const mailServers = await mailServerService.getAll()
		socket.emit('get_all_mail_servers_success', mailServers)

		const serverConfig = await serverConfigService.getConfig()
		socket.emit('get_server_config__success', serverConfig)

		const shareableUnits = await shareableUnitService.getAll()
		socket.emit('get_all_shareable_units__success', shareableUnits)

		const bookings: ShareableUnitBooking[] = await shareableUnitBookingService.getByUserId(user._id)
		socket.emit('get_my_shareable_unit_bookings__success', bookings)
	}

	const signIn = async ( { providerId, payload }: { providerId: string, payload: ICredentials } ): Promise<void> => {
		try {
			const user = await SignInService.signIn(providerId, payload)

			if ( user ) {
				await sendDataToUser(socket, user)

				socket.emit('sign_in_success', user)

				console.log('=> User: ' + user.firstName + ' ' + user.lastName + ' signed in')
			} else {
				socket.leave('signed-in')
				socket.emit('sign_in_failed')
			}
		} catch ( e ) {
			console.error('ERROR in signIn', e)
			socket.emit('sign_in_failed', e)
		}
	}

	const resignIn = async ( clientId: string ): Promise<void> => {
		try {
			const user: User = await SignInService.reSignIn(clientId)

			if ( user ) {
				await sendDataToUser(socket, user)

				socket.emit('re_sign_in_success', user)

				console.log('=> User: ' + user.firstName + ' ' + user.lastName + ' re-signed in')
			} else {
				socket.leave('signed-in')
				socket.emit('sign_in_failed')
			}
		} catch ( e ) {
			console.log('sign_in_failed', e)
			socket.emit('sign_in_failed', e)
		}
	}

	const signOut = async (): Promise<void> => {
		const rooms = Object.keys(socket.rooms)
		for ( let i = 1; i < rooms.length; i++ ) {
			socket.leave(rooms[i])
		}

		socket.emit('signed_out')
	}

	const getUsers = async () => {
		const users = await userService.getAll()
		socket.emit('get_users_success', users)
	}

	const getUserStatus = () => {
		socket.emit('get_user_status_success', UserService.getUserStatus())
	}

	const getUserRoles = () => {
		socket.emit('get_user_roles_success', UserService.getUserRoles())
	}

	const updateUser = async ( user: User ) => {
		io.emit('update_user_success', await userService.update(user))
	}

	const doesUserAccountAlreadyExist = async ( { userAccount, authProviderId }: { userAccount: string, authProviderId: string } ) => {
		const user = await userService.getByAuthProviderIdAndAccountName(authProviderId, userAccount)
		socket.emit('DOES_USER_ACCOUNT_ALREADY_EXIST_RESPONSE', !!user)
	}

	const signUp = async ( user: IUserApplication ): Promise<void> => {
		const alreadyStoredUser = await userService.getByAuthProviderIdAndAccountName(user.authProviderId, user.accountName)

		if ( !alreadyStoredUser ) {
			const savedUser = await userService.addLocal(user)
			socket.emit('SIGN_UP_USER_SUCCESS', savedUser)
		} else {
			socket.emit('SIGN_UP_USER_FAILED', 'USER_ACCOUNT_ALREADY_EXISTS')
		}
	}

	const confirmUserAccount = async ( userAccountId: string ): Promise<void> => {
		try {
			const user = await userService.confirmUser(userAccountId)
			socket.emit('CONFIRM_USER_ACCOUNT_SUCCESS', user)
		} catch ( e ) {
			console.log('CONFIRM_USER_ACCOUNT_FAILED', e)
			socket.emit('CONFIRM_USER_ACCOUNT_FAILED', e)
		}
	}

	const activateLocalUser = async ( user: User ): Promise<void> => {
		const savedUser = await userService.activateLocalUser(user)
		io.emit('update_user_success', savedUser)
	}

	socket
		.on('sign-in', signIn)
		.on('resign-in', resignIn)
		.on('sign-out', signOut)
		.on('get-users', getUsers)
		.on('get-user-status', getUserStatus)
		.on('get-user-roles', getUserRoles)
		.on('update-user', updateUser)
		.on('does-user-account-already-exist', doesUserAccountAlreadyExist)
		.on('sign-up-user', signUp)
		.on('confirm-user-account', confirmUserAccount)
		.on('activate-local-user', activateLocalUser)
}
