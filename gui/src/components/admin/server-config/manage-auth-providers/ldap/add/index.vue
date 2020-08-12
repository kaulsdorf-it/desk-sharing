<template>
  <ValidationObserver ref="observer" tag="form" v-slot="{ invalid }">
    <kit-dialog
      persistent
      scrollable
      title="LDAP-Service zur Benutzerauthentifizierung hinzufügen"
      width="1200"
    >
      <template v-slot:activatorBtn="{ open }">
        <v-btn
          @click="open"
          class="mr-2"
          color="primary"
          label
          outlined
        >
          <v-icon left>add</v-icon>
          LDAP-Service
        </v-btn>
      </template>

      <template slot="content">
        <v-row>
          <v-col cols="6">
            <v-row class="dense px-2">
              <v-col cols="12">
                <ValidationProvider :rules="formRules.name" name="Bezeichnung" v-slot="{ errors, validate }" vid="name">
                  <v-text-field
                    :error-messages="errors"
                    @keyup="validate"
                    dense
                    hint="Wird dem Benutzer zur Auswahl eines Anmeldedienstes angezeigt - sofern mehr als nur ein Dienst konfiguriert wird."
                    label="Bezeichnung"
                    persistent-hint
                    v-model="name"
                  />
                </ValidationProvider>
              </v-col>
            </v-row>

            <v-divider class="mt-2 mb-6"/>

            <span style="float: right; top: -4px; position: relative" v-if="ldapUrl">
              <v-btn
                :color="getBtnColor(urlTestResult)"
                @click="checkUrl"
                class="white"
                small
              >
                Prüfen
                <v-icon right size="18">{{ getIcon(urlTestResult) }}</v-icon>
              </v-btn>
            </span>

            <v-row class="dense px-2">
              <v-col cols="4">
                <ValidationProvider :rules="formRules.protocol" name="Protokoll" v-slot="{ errors, validate }" vid="protocol">
                  <v-select
                    :error-messages="errors"
                    :items="protocolOptions"
                    @keyup="validate"
                    dense
                    hint="ldap oder ldaps"
                    label="Protokoll"
                    persistent-hint
                    return-object
                    v-model="protocol"
                  />
                </ValidationProvider>
              </v-col>

              <v-col cols="5">
                <ValidationProvider :rules="formRules.host" name="Das Feld" v-slot="{ errors, validate }" vid="host">
                  <v-text-field
                    :error-messages="errors"
                    @keyup="validate"
                    dense
                    hint="IP-Adresse / Host-Name des LDAP-Servers"
                    label="URL"
                    persistent-hint
                    v-model="host"
                  />
                </ValidationProvider>
              </v-col>

              <v-col cols="3">
                <ValidationProvider :rules="formRules.port" name="Port" v-slot="{ errors, validate }" vid="port">
                  <v-text-field
                    :error-messages="errors"
                    @keyup="validate"
                    dense
                    hint="10 ... 65535"
                    label="Port"
                    persistent-hint
                    v-model="port"
                  />
                </ValidationProvider>
              </v-col>
            </v-row>

            <v-row class="dense">
              <v-col>
                <v-chip color="info" label outlined v-if="ldapUrl">
                  {{ ldapUrl }}
                </v-chip>
              </v-col>
            </v-row>

            <v-divider class="mb-6"/>

            <v-row class="dense px-2">
              <v-col cols="6">
                <ValidationProvider :rules="formRules.baseDN" name="baseDN" v-slot="{ errors, validate }" vid="baseDN">
                  <v-text-field
                    :error-messages="errors"
                    @keyup="validate"
                    dense
                    hint="z.B.: DC=bku,DC=db,DC=de"
                    label="baseDN"
                    persistent-hint
                    v-model="baseDN"
                  />
                </ValidationProvider>
              </v-col>
              <v-col cols="6">
                <ValidationProvider :rules="formRules.userDN" name="baseDN" v-slot="{ errors, validate }" vid="userDN">
                  <v-text-field
                    :error-messages="errors"
                    @keyup="validate"
                    dense
                    hint="z.B.: cn={0},OU=DB User Account,OU=Users,OU=Manage,OU=Desktop Services"
                    label="userDN"
                    persistent-hint
                    v-model="userDN"
                  />
                </ValidationProvider>
              </v-col>
            </v-row>

            <v-divider class="mb-6"/>

            <span style="float: right; top: -4px; position: relative" v-if="config">
              <v-btn
                :color="getBtnColor(technicalUserCheckResult)"
                @click="checkTechnicalUserAgainstLdap"
                class="white"
                small
              >
                Prüfen
                <v-icon right size="18">{{ getIcon(technicalUserCheckResult) }}</v-icon>
              </v-btn>
            </span>

            <v-row class="dense px-2">
              <v-col cols="12">
                <ValidationProvider :rules="formRules.userAccount" name="Benutzername" v-slot="{ errors, validate }" vid="userAccount">
                  <v-text-field
                    :error-messages="errors"
                    @keyup="validate"
                    dense
                    label="Benutzername"
                    v-model="userAccount"
                  />
                </ValidationProvider>
              </v-col>

              <v-col cols="6">
                <ValidationProvider name="Kennwort" rules="required" v-slot="{ errors, validate }" vid="password">
                  <v-text-field
                    :error-messages="errors"
                    @keyup="validate"
                    dense
                    label="Kennwort"
                    type="password"
                    v-model="password"
                  />
                </ValidationProvider>
              </v-col>
              <v-col cols="6">
                <ValidationProvider
                  name="Kennwort bestätigen"
                  rules="required|password:@password"
                  v-slot="{ errors, validate }"
                  vid="confirmPassword"
                >
                  <v-text-field
                    :error-messages="errors"
                    @keyup="validate"
                    dense
                    label="Kennwort bestätigen"
                    type="password"
                    v-model="confirmPassword"
                  />
                </ValidationProvider>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="6">
            <test
              :config="config"
              :technicalUserCheckResult="technicalUserCheckResult"
              :urlTestResult="urlTestResult"
            />
          </v-col>
        </v-row>
      </template>

      <template :close="close" v-slot:actions="{ close }">
        <btn-cancel @cancel="close"/>
        <v-spacer/>
        <btn-submit :disabled="invalid" @submit="submit(close)" label="LDAP-Service hinzufügen"/>
      </template>
    </kit-dialog>
  </ValidationObserver>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import Test from './test'

  export default {
    components: {
      Test,
    },

    computed: {
      ...mapGetters({
        getLdapServerUrlCheckResultByUrl: 'serverConfig/getLdapServerUrlCheckResultByUrl',
        getTechnicalUserCheckResultByConfig: 'serverConfig/getTechnicalUserCheckResultByConfig',
      }),
      ldapUrl() {
        return this.protocol && this.host && this.host.length > 0 && this.port
          ? this.protocol.protocol + '://' + this.host.trim() + ':' + this.port
          : null
      },
      config() {
        return this.ldapUrl && this.baseDN && this.userDN && this.userAccount && this.password
          ? {
            name: this.name,
            url: this.ldapUrl,
            baseDN: this.baseDN,
            userDN: this.userDN,
            user: this.userAccount,
            password: this.password,
          }
          : null
      },
      urlTestResult() {
        if (this.ldapUrl) {
          const result = this.getLdapServerUrlCheckResultByUrl(this.ldapUrl)
          return result || null
        }
        return null
      },
      technicalUserCheckResult() {
        return this.getTechnicalUserCheckResultByConfig(this.config)
      },
    },

    data: () => ({
      isFormValid: false,
      protocolOptions: [
        { text: 'ldaps', defaultPort: 7389, value: 'ldaps', protocol: 'ldaps' },
        { text: 'ldap', defaultPort: 7636, value: 'ldap', protocol: 'ldap' },
        { text: 'AD over ldaps', defaultPort: 636, value: 'ad-ldaps', protocol: 'ldaps' },
        { text: 'AD over ldap', defaultPort: 389, value: 'ad-ldap', protocol: 'ldap' },
      ],
      name: null,
      protocol: null,
      host: 'bku.db.de',
      port: 636,
      baseDN: 'DC=bku,DC=db,DC=de',
      userDN: 'cn={0},OU=DB User Account,OU=Users,OU=Manage,OU=Desktop Services',
      userAccount: '',
      password: '',
      confirmPassword: '',
      secure: null,
      formRules: {
        protocol: {
          required: true,
        },
        name: {
          required: true,
          min: 3,
        },
        host: {
          required: true,
          min: 3,
        },
        port: {
          required: true,
          min_value: 10,
          max_value: 65535,
        },
        baseDN: {
          required: true,
        },
        userDN: {
          required: true,
        },
        userAccount: {
          required: true,
        },
      }
    }),

    methods: {
      ...mapActions({
        checkLdapServerUrl: 'serverConfig/checkLdapServerUrlAction',
        checkTechnicalUser: 'serverConfig/checkTechnicalUserAction',
        updateAuthProvider: 'serverConfig/updateAuthProviderAction'
      }),
      getIcon(data) {
        if (!data) {
          return 'mdi-test-tube'
        }

        if (data.error) {
          return 'mdi-close'
        }

        if (data.result) {
          return 'mdi-check'
        }

        return 'mdi-timer-sand'
      },
      getBtnColor(data) {
        if (!data) {
          return 'warning'
        }

        if (data.error) {
          return 'error'
        }

        if (data.result) {
          return 'success'
        }

        return 'warning'
      },
      checkUrl() {
        if (this.ldapUrl) {
          this.checkLdapServerUrl(this.ldapUrl)
        }
      },
      checkTechnicalUserAgainstLdap() {
        this.checkTechnicalUser(this.config)
      },
      submit(close) {
        const payload = {
          type: 'ldap',
          provider: {
            baseDN: this.baseDN,
            userDN: this.userDN,
            name: this.name,
            url: this.ldapUrl,
            credentials: {
              user: this.userAccount,
              password: this.password,
            }
          }
        }

        this.updateAuthProvider(payload)
        close()
      },
    },

    watch: {
      protocol(protocolOption) {
        this.port = protocolOption.defaultPort
      },
    }
  }
</script>
