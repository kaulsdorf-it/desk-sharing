import { MailServer } from "../db-schemas/mail-servers"
import { MailServerService } from "../services/mail-servers"

export const registerMailServerEndpoints = ( io, socket ): void => {
	const service = new MailServerService()

	const add = async ( mailServer: MailServer ): Promise<void> => {
		try {
			const item = await service.add(mailServer)
			io.emit('UPDATE_MAIL_SERVER_SUCCESS', item)
		} catch ( err ) {
			console.error('ERROR on registerMailServerEndpoints.add', err)
			socket.emit('ADD_MAIL_SERVER_FAILED', err)
		}
	}

	const update = async ( mailServer: MailServer ): Promise<void> => {
		try {
			const item = await service.update(mailServer)
			io.emit('UPDATE_MAIL_SERVER_SUCCESS', item)
		} catch ( err ) {
			console.error('ERROR on registerMailServerEndpoints.update', err)
			socket.emit('UPDATE_MAIL_SERVER_FAILED', err)
		}
	}

	const remove = async ( id: string ): Promise<void> => {
		try {
			const item = await service.remove(id)
			io.emit('REMOVE_MAIL_SERVER_SUCCESS', item)
		} catch ( err ) {
			console.error('ERROR on registerMailServerEndpoints.remove', err)
			socket.emit('REMOVE_MAIL_SERVER_FAILED', err)
		}
	}

	socket
		.on('add-mail-server', add)
		.on('update-mail-server', update)
		.on('remove-mail-server', remove)
}
