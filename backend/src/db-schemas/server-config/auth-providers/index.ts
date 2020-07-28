import { AuthLdap } from './ldap'
import { AuthSaml2Idp } from './saml-2-idp'
import { AuthLocal } from './local'
import { modelOptions, prop } from "@typegoose/typegoose"
import { EnumAuthProviderType } from '../../enums/auth-provider-types'

@modelOptions({ schemaOptions: { collection: "AuthProviders" } })
export class AuthProvider {
	@prop({ required: true, enum: EnumAuthProviderType, type: String })
	type!: EnumAuthProviderType

	@prop({ required: true })
	provider!: AuthLdap | AuthSaml2Idp | AuthLocal
}
