import { detectApiKey } from '../../../src/infrastructure/detect-api-key'

let req: any
let res: any
const next: any = jest.fn(() => {
	console.log('next()')
})

beforeEach(() => {
	req = { headers: {} }
	res = { send: jest.fn() }
	next.mockReset()
})

describe('infrastructure', () => {
		test('detectApiKey should not detect any API key', async () => {
			detectApiKey(req, res, next)

			expect(req.apiKey).toBeUndefined()
			expect(next.mock.calls.length).toEqual(1)
		})

		test('detectApiKey should detect the API key of "1234567890-api-key-0987654321"', async () => {
			const headerValue = '1234567890-api-key-0987654321'
			req.headers.authorization = `Bearer ${ headerValue }`
			detectApiKey(req, res, next)

			expect(req.apiKey).toEqual(headerValue)
			expect(next.mock.calls.length).toEqual(1)
		})

		test('detectApiKey should not detect any API key', async () => {
			const headerValue = '1234567890-api-key-0987654321'
			req.headers.authorization = `Bearer${ headerValue }`
			detectApiKey(req, res, next)

			expect(req.apiKey).toBeUndefined()
			expect(next.mock.calls.length).toEqual(1)
		})

		test('detectApiKey should detect the API key of "api-key-0987654321" even if there are too many whitespaces in between', async () => {
			const headerValue = 'api-key-0987654321'
			req.headers.authorization = `Bearer       ${ headerValue }`
			detectApiKey(req, res, next)

			expect(req.apiKey).toEqual(headerValue)
			expect(next.mock.calls.length).toEqual(1)
		})
	}
)
