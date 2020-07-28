export declare interface IUser {
	_id?: String,
	status: String,
	accountName: String,
	firstName: String,
	lastName: String,
	roles: String[],
	clientIds?: String[],
	password?: String,
	mail?: String,
}

export declare interface ICredentials {
	accountName: string,
	password: string,
}
