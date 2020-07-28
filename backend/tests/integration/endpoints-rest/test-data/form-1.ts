import { FormStage } from '../../../../src/db-schemas/enums/form-stages'

export default {
	_id: '5ed755c91002c601961ce6b7',
	mailServerId: '5ed755c91002c601961ce6b2',
	stage: FormStage.PROD,
	name: 'Form of ...',
	description: 'yjhgcjsh berkuzg lreuhjfs\n\najdsa',
	formDomain: '5ed7559d1002c601961ce6b6',
	stageChanges: [],
	needsApproval: false,
	mails: [
		{
			attachFilesForTargets: [
				'form.fotos',
				'form.employee.passportImages'
			],
			targets: [
				{
					'type': 'mail_address',
					'mailRole': 'to',
					'value': 'gdrahota@googlemail.com'
				}
			],
			subject: '<span class=\'variable\' data-variable-target=\'form.employee.email\'>E-Mail-Adresse (form.employee.email)</span>',
			mailText: 'Hallo <span class=\'variable\' data-variable-target=\'form.employee.firstName\'>Vorname (form.employee.firstName)</span> <span class=\'variable\' data-variable-target=\'form.employee.lastName\'>Nachname (form.employee.lastName)</span>!'
		}
	],
	conditionalFields: [
		{
			'targets': [
				'5edf7a0baa979c0000d6f548',
				'5edf7a72aa979c0000d6f54c',
				'5edf7a90aa979c0000d6f54d'
			],
			'values': [
				{
					'_id': '5edf7d653e5acf002397b80b',
					'target': '5edf7c9daa979c0000d6f550',
					'test': true
				}
			],
			'_id': '5edf7d4caa979c0000d6f551',
			'operator': 'AND'
		}
	],
	additionalInfoGroups: [
		{
			items: [
				{
					'_id': 'b1b4853a-a92f-4f07-890c-0c877083c7f3',
					'type': 'doc',
					'upload': {
						'name': 'form--5ed755c91002c601961ce6b7-additional-info/5ef1e3d14450500022f10812.png',
						'size': 8757219,
						'wrote': 8757219,
						'uploadDir': '/uploads/form--5ed755c91002c601961ce6b7-additional-info/5ef1e3d14450500022f10812.png',
						'data': {
							'type': 'additionalInfoDocumentForForm',
							'formId': '5ed755c91002c601961ce6b7'
						},
						'mime': 'image/png',
						'estimated': 4022,
						'uploadId': 'u_1',
						'originalFileName': 'Guido-Drahota.png'
					},
					'label': 'Test'
				}
			],
			'_id': '25201927-88ab-4d7e-b674-4799590852a1',
			'title': 'Auffüllhilfe'
		}
	],
	apiKey: 'cf1a39a5-3a43-46b2-ab5b-5258b2c38929'
}
