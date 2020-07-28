import MongoDb from '../../src/infrastructure/mongodb'

const config = {
	server: {
		host: 'localhost',
		port: 3000
	},
	mongoDb: {
		url: 'mongodb://localhost:27017/forms--test',
		options: {
			useNewUrlParser: true
		}
	}
}

export class Setup {
	private mongoDbConnection
	private mongodb = new MongoDb(config)

	async connectToMongoDb(): Promise<void> {
		try {
			this.mongoDbConnection = await this.mongodb.connect()
		} catch ( e ) {
			console.log('ERROR in connectToMongoDb', e)
		}
	}

	async closeDatabaseConnection(): Promise<void> {

	}

	dumpData(): void {
		this.mongodb.dropDatabase('forms--tes')
	}
}
