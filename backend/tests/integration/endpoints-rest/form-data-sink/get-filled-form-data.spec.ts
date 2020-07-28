import { Setup } from '../../setup'
import { FormRepository } from '../../../../src/repositories/forms'
import { getFilledFormData } from '../../../../src/endpoints-rest/form-data-sink/get-filled-form-data'
import formData_1 from '../test-data/form-1'
import filledForm_1 from '../test-data/filled-form-1'
import { FilledFormRepository } from "../../../../src/repositories/filled-forms"

jest.setTimeout(1000)

let req: any
let res: any
const apiKey = formData_1.apiKey

const setup = new Setup()

beforeAll(async () => {
	await setup.connectToMongoDb()
})

beforeEach(async () => {
	req = { apiKey }
	res = { send: jest.fn(), status: jest.fn() }
	setup.dumpData()
})

afterAll(async () => {
})

describe('endpoints-rest/form-data-sink/getFilledFormData()', () => {
	test('no form and no filledForm: should send any data', async () => {
		req.params = {
			filledFormId: filledForm_1._id
		}

		await getFilledFormData(req, res)

		expect(res.status.mock.calls.length).toEqual(1)
		expect(res.send.mock.calls.length).toEqual(0)
	})

	test('one form and no filledForm: should send any data', async () => {
		const formRepository = new FormRepository()
		// @ts-ignore
		await formRepository.add(formData_1)

		req.params = {
			filledFormId: filledForm_1._id
		}

		await getFilledFormData(req, res)

		expect(res.status.mock.calls.length).toEqual(1)
		expect(res.send.mock.calls.length).toEqual(0)
		expect(res.status.mock.calls[0][0]).toEqual(404)
	})

	test('one form and one filledForm: should send filledForm_1', async () => {
		const formRepository = new FormRepository()
		// @ts-ignore
		await formRepository.add(formData_1)

		const filledFormRepository = new FilledFormRepository()
		// @ts-ignore
		await filledFormRepository.add(filledForm_1)

		req.params = {
			filledFormId: filledForm_1._id
		}

		await getFilledFormData(req, res)

		expect(res.status.mock.calls.length).toEqual(0)
		expect(res.send.mock.calls.length).toEqual(1)
		expect(res.send.mock.calls[0][0]._id.toString()).toEqual('5ef07b778539e700007b9621')
	})

	test('one form and one filledForm but wrong API key: should send any data', async () => {
		const formRepository = new FormRepository()
		// @ts-ignore
		await formRepository.add(formData_1)

		const filledFormRepository = new FilledFormRepository()
		// @ts-ignore
		await filledFormRepository.add(filledForm_1)

		req.apiKey = 'wrong key'
		req.params = {
			filledFormId: filledForm_1._id
		}

		await getFilledFormData(req, res)

		expect(res.status.mock.calls.length).toEqual(1)
		expect(res.send.mock.calls.length).toEqual(0)
	})
})
