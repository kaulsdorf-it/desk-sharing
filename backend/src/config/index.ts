'use strict'

const config = {
	test: {
		server: {
			host: 'localhost',
			port: 3000
		},
		mongoDb: {
			url: 'mongodb://localhost:27017/desc-sharing--test',
			options: {
				useNewUrlParser: true
			}
		}
	},

	development: {
		server: {
			port: 3000,
			host: '0.0.0.0'
		},
		mongoDb: {
			url: 'mongodb://localhost:27017/desc-sharing--dev',
			options: {
				useNewUrlParser: true
			}
		}
	},

	production: {
		server: {
			host: 'localhost',
			port: 3000
		},
		mongoDb: {
			url: 'mongodb://forms-mongodb:27017/desc-sharing--prod',
			options: {
				useNewUrlParser: true
			}
		}
	}
}

module.exports = config[process.env.NODE_ENV || 'development']
