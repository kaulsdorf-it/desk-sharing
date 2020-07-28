import Moment from 'moment'
import { MailTargetType } from '../../db-schemas/enums/mail-target-types'
import { ServerConfig } from "../../db-schemas/server-config"
import { MailConfig } from '../../db-schemas/forms'
import { Attachment } from '../../db-schemas/mail-queue'
import { MailQueueService } from '../mail-queue'
import { FilledFormService } from '../filled-forms'
import { FormService } from '../forms'
import { UserService } from '../user'
import { FormElementService } from '../form-elements'
import { replaceElementByText } from '../../utils/find-xml-element-and-replace'
import { ServerConfigService } from "../server-config"

interface IReplacementAttribute {
	name: string,
	value: string,
}

interface IReplacement {
	attributes: IReplacementAttribute[],
	replaceBy: string
}

export class TaskService {
	private readonly filledFormId: string
	private readonly mailQueueService: MailQueueService
	private readonly filledFormService: FilledFormService
	private readonly userService: UserService
	private readonly formService: FormService
	private readonly formElementService: FormElementService

	constructor( filledFormId: string ) {
		this.filledFormId = filledFormId
		this.mailQueueService = new MailQueueService()
		this.filledFormService = new FilledFormService()
		this.userService = new UserService()
		this.formService = new FormService()
		this.formElementService = new FormElementService()
	}

	public async informApprover(): Promise<void> {
		const filledForm = await this.filledFormService.getById(this.filledFormId)

		if ( !filledForm ) {
			throw Error('FILLED FORM NOT FOUND')
		}

		if ( !filledForm.approver ) {
			return
		}

		const formService = new FormService()
		const form = await formService.getById(filledForm.formId)

		const serverConfig: ServerConfig | null = await ServerConfigService.getConfig()

		if ( serverConfig === null ) {
			throw ('SERVER CONFIG FOUND')
		}

		const confirmationLink = serverConfig.hostName + (serverConfig.hostName.endsWith('/') ? '' : '/') + 'approve-form-application/'

		await this.mailQueueService.add({
			createdAt: Moment(),
			mailServerId: form.mailServerId,
			to: [filledForm.approver, 'guido.drahota@deutschebahn.com'],
			cc: [],
			bcc: [],
			subject: 'Freigabe erbeten',
			attachments: [],
			content: `Sie werden gebeten, bei ${ serverConfig.serverDescription.companyName } FORMS den Antrag "${ form.name }" eines
Antragstellers freizugeben.
<br/>
<br/>
<b>Bitte klicken Sie <a href="${ confirmationLink }">hier</a>, um zum Antrag zu gelangen!</b>
<br/><br/><br/>
${ serverConfig.serverDescription.companyName } FORMS
`
		})
	}

	public async informApplicantAboutApproval(): Promise<void> {
		const filledForm = await this.filledFormService.getById(this.filledFormId)

		if ( !filledForm ) {
			throw Error('FILLED FORM NOT FOUND')
		}

		const formService = new FormService()
		const form = await formService.getById(filledForm.formId)

		const user = await this.userService.getById(filledForm.userId)

		if ( !user ) {
			throw Error('USER NOT FOUND')
		}

		await this.mailQueueService.add({
			createdAt: Moment(),
			mailServerId: form.mailServerId,
			to: [user.mail],
			cc: [],
			bcc: [],
			subject: 'Freigabe erteilt',
			content: 'Freigabe erteilt',
			attachments: [],
		})
	}

	public async informApplicantAboutDisapproval(): Promise<void> {
		const filledForm = await this.filledFormService.getById(this.filledFormId)

		if ( !filledForm ) {
			throw Error('FILLED FORM NOT FOUND')
		}

		const user = await this.userService.getById(filledForm.userId)

		if ( !user ) {
			throw Error('USER NOT FOUND')
		}

		const formService = new FormService()
		const form = await formService.getById(filledForm.formId)

		await this.mailQueueService.add({
			createdAt: Moment(),
			mailServerId: form.mailServerId,
			to: [user.mail],
			cc: [],
			bcc: [],
			subject: 'Freigabe verweigert',
			content: 'Freigabe verweigert',
			attachments: [],
		})
	}

	public async distributeFormData(): Promise<void> {
		const filledForm = await this.filledFormService.getById(this.filledFormId)

		if ( !filledForm ) {
			throw Error('FILLED FORM NOT FOUND')
		}

		const form = await this.formService.getById(filledForm.formId)

		if ( !form ) {
			throw Error('FORM NOT FOUND')
		}

		const formElements = await this.formElementService.getByFormId(filledForm.formId)

		const getMailTargetsByMailRole =
			( { targets }, mailRole: string ) =>
				targets
					.filter(target => target.mailRole === mailRole)
					.map(target => {
						if ( target.type === MailTargetType.MAIL_ADDRESS ) {
							return target.value
						} else {
							// find element
							const node = formElements.find(i => i._id.toString() === target.value)
							return node?.localNode?.config?.target
								? this.getTargetValue(node.localNode.config.target, filledForm.formData)
								: null
						}
					})
					.filter(i => i)

		const mailQueuePromises: Promise<void>[] = form.mails.map(( mailConfig: MailConfig ) => {
			let subject = mailConfig.subject
			let content = mailConfig.mailText ? mailConfig.mailText.toString() : 'nix drin :('

			this.getReplacements(formElements, filledForm).forEach(i => {
				subject = replaceElementByText(subject, { elementName: 'span', attributes: i.attributes }, i.replaceBy)
				content = replaceElementByText(content, { elementName: 'span', attributes: i.attributes }, i.replaceBy)
			})

			// collect files..
			const attachments: Attachment[] = []

			if ( mailConfig.attachFilesForTargets ) {
				mailConfig.attachFilesForTargets.forEach(target => {
					const files = this.getTargetValue(target, filledForm.formData)

					if ( files ) {
						files.forEach(file => {
							attachments.push({
								filename: file.originalFileName,
								contentType: file.mime,
								path: '/uploads/' + file.name,
							})
						})
					}
				})
			}

			const payload = {
				createdAt: Moment(),
				mailServerId: form.mailServerId,
				to: getMailTargetsByMailRole(mailConfig, 'to'),
				cc: getMailTargetsByMailRole(mailConfig, 'cc'),
				bcc: getMailTargetsByMailRole(mailConfig, 'bcc'),
				subject,
				content,
				attachments,
			}

			return this.mailQueueService.add(payload)
		})

		await Promise.all(mailQueuePromises)
	}

	private getTargetValue = ( target: string, formData: any ) => {
		const targetParts = target.split('.')
		targetParts.shift()

		let response = { ...formData }

		targetParts.forEach(targetPart => {
			response = response[targetPart]
		})

		return response
	}

	private getReplacements = ( formElements, filledForm ): IReplacement[] => {
		return formElements
			.filter(i => i.localNode.config.target)
			.map(i => {
				const value = this.getTargetValue(i.localNode.config.target, filledForm.formData)

				const getListValue = () => {
					const listItem = i.localNode.config.items.find(i => i.value === value)
					return listItem ? listItem.text : value
				}

				return {
					attributes: [{ name: 'class', value: 'variable' }, { name: 'data-variable-target', value: i.localNode.config.target }],
					replaceBy: i.localNode.config.items
						? getListValue()
						: value
				}
			})
	}
}
