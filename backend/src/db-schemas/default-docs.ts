import { ServerConfigRepository } from '../repositories/server-config'
import { UserService } from '../services/user'
import { BuildingService } from '../services/buildings'
import { RoomService } from '../services/rooms'
import { ShareableUnitService } from '../services/shareable-units'
import { EnumAuthProviderType } from './enums/auth-provider-types'

const serverConfig = {
	_id: '5f2ff5f9dcbc1b0022ce0c6c',
	hostName: 'localhost',
	authProviders: [{
		type: EnumAuthProviderType.LOCAL,
		provider: {
			name: 'LOCAL',
			url: 'localhost',
			passwordExpiresInDays: 30,
			anonymizeAccountOnInactivityAfterDays: 365,
		}
	}]
}

const users = [
	{
		accountName: 'testuser1',
		password: 'testuser1',
		firstName: 'Test',
		lastName: 'User 1',
		mail: 'testuser1@kaulsdorf-it-solutions.de',
	},
	{
		accountName: 'testuser2',
		password: 'testuser2',
		firstName: 'Test',
		lastName: 'User 2',
		mail: 'testuser2@kaulsdorf-it-solutions.de',
	},
	{
		accountName: 'testuser3',
		password: 'testuser3',
		firstName: 'Test',
		lastName: 'User 3',
		mail: 'testuser3@kaulsdorf-it-solutions.de',
	},
]

const buildings = [
	{
		'_id': '5f1eb041e5d76c30f9afe4d0',
		'name': 'Gebäude 1'
	},
	{
		'_id': '5f1eb041e5d76c30f9afe4d1',
		'name': 'Gebäude 2'
	},
	{
		'_id': '5f1eb041e5d76c30f9afe4d2',
		'name': 'Gebäude 3'
	},
	{
		'_id': '5f1eb041e5d76c30f9afe4d3',
		'name': 'Gebäude 4'
	},
]

const rooms = [
	{
		'_id': '5f1eb859e5d76c30f9afe4a0',
		'name': 'Raum A1.01',
		'buildingId': '5f1eb041e5d76c30f9afe4d0'
	},
	{
		'_id': '5f1eb859e5d76c30f9afe4a1',
		'name': 'Raum A1.02',
		'buildingId': '5f1eb041e5d76c30f9afe4d0'
	},
	{
		'_id': '5f1eb859e5d76c30f9afe4a2',
		'name': 'Raum A1.03',
		'buildingId': '5f1eb041e5d76c30f9afe4d0'
	},
	{
		'_id': '5f1eb859e5d76c30f9afe4a3',
		'name': 'Raum A1.04',
		'buildingId': '5f1eb041e5d76c30f9afe4d0'
	},
	{
		'_id': '5f1eb859e5d76c30f9afe4a4',
		'name': 'Raum A1.05',
		'buildingId': '5f1eb041e5d76c30f9afe4d0'
	},

	{
		'_id': '5f1eb859e5d76c30f9afe4e5',
		'name': 'Raum B1.01',
		'buildingId': '5f1eb859e5d76c30f9afe4e1'
	},
	{
		'_id': '5f1eb859e5d76c30f9afe4a6',
		'name': 'Raum B1.02',
		'buildingId': '5f1eb859e5d76c30f9afe4e1'
	},
	{
		'_id': '5f1eb859e5d76c30f9afe4a7',
		'name': 'Raum B1.03',
		'buildingId': '5f1eb859e5d76c30f9afe4e1'
	},
	{
		'_id': '5f1eb859e5d76c30f9afe4a8',
		'name': 'Raum B1.04',
		'buildingId': '5f1eb859e5d76c30f9afe4e1'
	},
	{
		'_id': '5f1eb859e5d76c30f9afe4aa',
		'name': 'Raum B1.05',
		'buildingId': '5f1eb859e5d76c30f9afe4e1'
	},
]

const shareableUnits = [
	{
		'_id': '5f1ecf53e5d76c30f9afe4b0',
		'name': 'Tisch 1',
		'roomId': '5f1eb859e5d76c30f9afe4a0'
	},
	{
		'_id': '5f1ecf53e5d76c30f9afe4b1',
		'name': 'Tisch 2',
		'roomId': '5f1eb859e5d76c30f9afe4a0'
	},
	{
		'_id': '5f1ecf53e5d76c30f9afe4b2',
		'name': 'Tisch 3',
		'roomId': '5f1eb859e5d76c30f9afe4a0'
	},
	{
		'_id': '5f1ecf53e5d76c30f9afe4b3',
		'name': 'Tisch 4',
		'roomId': '5f1eb859e5d76c30f9afe4a0'
	},
	{
		'_id': '5f1ecf53e5d76c30f9afe4b4',
		'name': 'Tisch 5',
		'roomId': '5f1eb859e5d76c30f9afe4a0'
	},
	{
		'_id': '5f1ecf53e5d76c30f9afe4b5',
		'name': 'Tisch 6',
		'roomId': '5f1eb859e5d76c30f9afe4a0'
	},

	{
		'_id': '5f1ecf53e5d76c30f9afe4b6',
		'name': 'Tisch 1',
		'roomId': '5f1eb859e5d76c30f9afe4a1'
	},
	{
		'_id': '5f1ecf53e5d76c30f9afe4b7',
		'name': 'Tisch 2',
		'roomId': '5f1eb859e5d76c30f9afe4a1'
	},
	{
		'_id': '5f1ecf53e5d76c30f9afe4b8',
		'name': 'Tisch 3',
		'roomId': '5f1eb859e5d76c30f9afe4a1'
	},
	{
		'_id': '5f1ecf53e5d76c30f9afe4ba',
		'name': 'Tisch 4',
		'roomId': '5f1eb859e5d76c30f9afe4a1'
	},
	{
		'_id': '5f1ecf53e5d76c30f9afe4bb',
		'name': 'Tisch 5',
		'roomId': '5f1eb859e5d76c30f9afe4a1'
	},
	{
		'_id': '5f1ecf53e5d76c30f9afe4bc',
		'name': 'Tisch 6',
		'roomId': '5f1eb859e5d76c30f9afe4a1'
	},
	{
		'_id': '5f1ecf53e5d76c30f9afe4bd',
		'name': 'Tisch 6',
		'roomId': '5f1eb859e5d76c30f9afe4a1'
	},
]

export const populateDemoData = async () => {
	try {
		const serverConfigRepository = new ServerConfigRepository()
		const userService = new UserService()
		const buildingService = new BuildingService()
		const roomService = new RoomService()
		const shareableUnitService = new ShareableUnitService()


		await serverConfigRepository.add(serverConfig)

		const serverConfigFromDb = await serverConfigRepository.getConfig()
		// @ts-ignore
		const authProviderId = serverConfigFromDb?.authProviders[0]._id

		await Promise.all(users.map(u => ({ ...u, authProviderId })).map(u => userService.addLocal(u)))
		await Promise.all(buildings.map(b => buildingService.add(b)))
		await Promise.all(rooms.map(r => roomService.add(r)))
		await Promise.all(shareableUnits.map(su => shareableUnitService.add(su)))
	} catch ( e ) {
		console.log('DEMO DATA ALREADY INSTALLED')
	}
}
