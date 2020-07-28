import { RailwayStationApi } from '../../adapter/railway-stations'

const sortByName = ( a, b ) => a.name.localeCompare(b.name)

export const registerAutocompleteEndpoints = ( io, socket ): void => {
	const service = new RailwayStationApi()

	socket.on('search-railway-stations', async ( { searchStr, id } ): Promise<any> => {
		try {
			const results = await service.search(searchStr)
			socket.emit('search_in_external_resources_success', { id, results: results.sort(sortByName) })
		} catch ( e ) {
			console.error('ERROR in RailwayStationApi.search(searchStr)', e)
		}
	})
}
