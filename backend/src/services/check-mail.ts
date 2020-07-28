const checkMailDomain = require('email-domain-check')

export class MailValidationService {
	static async validate( mail: string ): Promise<boolean> {
		return checkMailDomain(mail)
	}
}
