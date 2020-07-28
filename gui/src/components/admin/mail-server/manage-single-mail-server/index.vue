<template>
  <ValidationObserver ref="observer" tag="form" v-slot="{ invalid }">
    <v-card v-if="mailServer">
      <v-toolbar color="info" dark dense>
        <v-toolbar-title>E-Mail-Server</v-toolbar-title>
      </v-toolbar>

      <v-card-text style="height: calc(100vh - 252px); overflow-y: auto">
        <v-row>
          <v-col cols="3">
            <validation-provider :rules="rules.name" name="Die Bezeichnung" v-slot="{ errors, validate }">
              <v-text-field
                :error-messages="errors"
                @input="validate"
                clearable
                filled
                label="Bezeichnung *"
                v-model="mailServer.name"
              />
            </validation-provider>
          </v-col>
        </v-row>

        <v-divider/>

        <v-row>
          <v-col cols="12">
            <v-chip label>SMTP Server:</v-chip>
          </v-col>
          <v-col cols="4">
            <validation-provider :rules="rules.host" name="Der Server-Name / die IP-Adresse" v-slot="{ errors, validate }">
              <v-text-field
                :error-messages="errors"
                @input="validate"
                clearable
                filled
                hint="Server-Name / IP-Adresse *"
                label="Host"
                persistent-hint
                v-model="mailServer.host"
              />
            </validation-provider>
          </v-col>

          <v-col cols="2">
            <validation-provider :rules="rules.port" name="Der IP-Port" v-slot="{ errors, validate }">
              <v-text-field
                :error-messages="errors"
                @input="validate"
                clearable
                filled
                label="IP-Port *"
                type="number"
                v-model="mailServer.port"
              />
            </validation-provider>
          </v-col>
        </v-row>

        <v-divider/>

        <v-row>
          <v-col cols="12">
            <v-chip label>Absender:</v-chip>
          </v-col>
          <v-col cols="3">
            <validation-provider name="Die E-Mail-Adresse des Absender" rules="required|email" v-slot="{ errors, validate }">
              <v-text-field
                :error-messages="errors"
                @input="validate"
                clearable
                filled
                label="E-Mail-Adresse *"
                v-model="mailServer.from.mail"
              />
            </validation-provider>
          </v-col>
          <v-col cols="3">
            <v-text-field
              clearable
              filled
              label="Name"
              v-model="mailServer.from.name"
            />
          </v-col>
        </v-row>

        <v-divider/>

        <v-row>
          <v-col cols="12">
            <v-chip label>Sicherheitseinstellungen:</v-chip>
            <v-checkbox
              label="TLS-Verbindung nutzen"
              v-model="mailServer.secure"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="3">
            <validation-provider :rules="rules.user" name="Der Anmeldename" v-slot="{ errors, validate }">
              <v-text-field
                :error-messages="errors"
                @input="validate"
                autocomplete="new-password"
                clearable
                filled
                hint="Anmeldename (am SMTP-Server)"
                label="Anmeldename *"
                persistent-hint
                v-model="mailServer.auth.user"
              />
            </validation-provider>
          </v-col>

          <v-col cols="3">
            <validation-provider :rules="rules.pass" name="Das Kennwort" v-slot="{ errors, validate }">
              <v-text-field
                :error-messages="errors"
                @input="validate"
                autocomplete="new-password"
                clearable
                filled
                label="Kennwort *"
                type="password"
                v-model="mailServer.auth.pass"
              />
            </validation-provider>
          </v-col>

          <v-col cols="3">
            <validation-provider :rules="rules.confirm" name="Das Kennwort" v-slot="{ errors, validate }" vid="confirm">
              <v-text-field
                :error-messages="errors"
                @input="validate"
                autocomplete="new-password"
                clearable
                filled
                label="Kennwort bestätigen *"
                type="password"
                v-model="confirm"
              />
            </validation-provider>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider/>

      <v-card-actions class="grey lighten-3">
        <confirm-dialog
          @agree="removeMailServer()"
          btnColor="error"
          icon="mdi-delete-outline"
          label="Löschen"
          title="Diesen E-Mail-Server löschen"
        />
        <v-spacer/>
        <btn-cancel @cancel="close"/>
        <btn-submit :disabled="invalid" @submit="submit"/>
      </v-card-actions>
    </v-card>
  </ValidationObserver>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters({
        getById: 'systemConfig/mailServers/getById',
        getAllForms: 'systemConfig/mailServers/getAll',
      }),
      rules() {
        return {
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
            min_value: 1,
            max_value: 32000,
          },
          user: {
            min: 2,
          },
          pass: {
            password: this.confirm,
          },
        }
      }
    },

    created() {
      this.init()
    },

    data: () => ({
      mailServer: null,
      confirm: null,
    }),

    methods: {
      ...mapActions({
        add: 'systemConfig/mailServers/addAction',
        update: 'systemConfig/mailServers/updateAction',
        remove: 'systemConfig/mailServers/removeAction',
      }),
      init() {
        this.confirm = null
        switch (this.$route.params.mailServerId) {
          case 'new':
            this.mailServer = {
              secure: false,
              auth: {
                user: '',
                pass: '',
              },
              from: {
                name: null,
                mail: null,
              },
            }
            break
          case null:
            this.mailServer = null
            break
          default:
            const mailServer = this.getById(this.$route.params.mailServerId)
            this.mailServer = JSON.parse(JSON.stringify(mailServer))
        }
      },
      submit() {
        if (this.mailServer._id) {
          this.update(this.mailServer)
        } else {
          this.add(this.mailServer)
        }
        this.close()
      },
      close() {
        this.navigateToRoute('manage-mail-servers')
      },
      removeMailServer() {
        this.remove(this.mailServer._id)
        this.close()
      }
    },

    watch: {
      '$route.params.mailServerId'() {
        this.init()
      }
    }
  }
</script>
