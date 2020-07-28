import { Setup } from '../../setup'
import { FormRepository } from '../../../../src/repositories/forms'
import { FilledFormRepository } from '../../../../src/repositories/filled-forms'
import formData_1 from '../test-data/form-1'
import filledForm_1 from '../test-data/filled-form-1'
import filledForm_2 from '../test-data/filled-form-2'
import { getFilledFormIds } from '../../../../src/endpoints-rest/form-data-sink/get-filled-form-ids'

jest.setTimeout(10000)

let req: any
let res: any
const apiKey = formData_1.apiKey

const setup = new Setup()

beforeAll(async () => {
	await setup.connectToMongoDb()
})

beforeEach(async () => {
	req = { apiKey }
	res = { send: jest.fn() }
	setup.dumpData()
})

afterAll(async () => {
})

describe('endpoints-rest/form-data-sink/getFilledFormIds()', () => {
		test('should send an empty array', async () => {
			const formRepository = new FormRepository()
			// @ts-ignore
			await formRepository.add(formData_1)

			await getFilledFormIds(req, res)

			expect(res.send.mock.calls.length).toEqual(1)
			expect(res.send.mock.calls[0][0].length).toEqual(0)
		})

		test('should send an array containing one doc id', async () => {
			const formRepository = new FormRepository()
			// @ts-ignore
			await formRepository.add(formData_1)

			const filledFormRepository = new FilledFormRepository()
			// @ts-ignore
			await filledFormRepository.add(filledForm_1)

			await getFilledFormIds(req, res)

			expect(res.send.mock.calls.length).toEqual(1)
			expect(res.send.mock.calls[0][0][0]).toEqual('5ef07b778539e700007b9621')
		})

		test('should send an array containing two doc ids', async () => {
			const formRepository = new FormRepository()
			// @ts-ignore
			await formRepository.add(formData_1)

			const filledFormRepository = new FilledFormRepository()
			// @ts-ignore
			await filledFormRepository.add(filledForm_1)
			// @ts-ignore
			await filledFormRepository.add(filledForm_2)

			await getFilledFormIds(req, res)

			expect(res.send.mock.calls.length).toEqual(1)
			expect(res.send.mock.calls[0][0][0]).toEqual('5ef07b778539e700007b9621')
			expect(res.send.mock.calls[0][0][1]).toEqual('5ef07b778539e700007b9622')
		})
	}
)
