import mongoose from 'mongoose'

mongoose.Promise = global.Promise
mongoose.set('useFindAndModify', false)
mongoose.set('useUnifiedTopology', true)

export default class {
	notConnected: boolean = true
	retriesLeft: number = 10
	private instance!: mongoose.Mongoose
	private readonly config

	constructor( config: any ) {
		this.config = config
	}

	connect = async () => {
		console.log('mongoDb', this.config.mongoDb)
		while ( this.notConnected && this.retriesLeft > 0 ) {
			try {
				this.instance = await this._connect()
				this.notConnected = false
			} catch ( err ) {
				console.log('ERROR', err)
				await new Promise(resolve => setTimeout(resolve, 3000))
				this.retriesLeft--
				console.log('retriesLeft', this.retriesLeft)
				if ( this.retriesLeft === 0 ) {
					throw 'CANNOT_CONNECT_TO_MONGODB'
				}
			}
		}
	}

	disconnect = (): Promise<void> => this.instance.connection.close()

	dropDatabase = name => this.instance.connection.dropDatabase(name)

	private _connect = async (): Promise<mongoose.Mongoose> => mongoose.connect(this.config.mongoDb.url, this.config.mongoDb.options)
}
