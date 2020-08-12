<template>
  <ValidationObserver ref="observer" tag="form" v-slot="{ invalid }">
    <kit-dialog
      persistent
      scrollable
      title="Lokale Benutzerauthentifizierung hinzufügen"
      width="800"
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
          Lokale Benutzerauthentifizierung
        </v-btn>
      </template>

      <template slot="content">
        <v-row class="dense">
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

        <v-row class="dense">
          <v-col cols="4">
            <ValidationProvider
              :rules="formRules.passwordExpiresInDays"
              name="Kennwortablaufzeit"
              v-slot="{ errors, validate }"
              vid="passwordExpiresInDays"
            >
              <v-text-field
                :error-messages="errors"
                @keyup="validate"
                dense
                hint="Ablaufzeit des Kennworts in Tagen"
                label="Kennwortablaufzeit"
                persistent-hint
                type="number"
                v-model="passwordExpiresInDays"
              />
            </ValidationProvider>
          </v-col>
          <v-col cols="4">
            <ValidationProvider
              :rules="formRules.anonymizeAccountOnInactivityAfterDays"
              name="Konto anonymisieren nach x Tagen"
              v-slot="{ errors, validate }"
              vid="anonymizeAccountOnInactivityAfterDays"
            >
              <v-text-field
                :error-messages="errors"
                @keyup="validate"
                dense
                hint="Inaktive Benutzerkonten anonymisieren nach x Tagen"
                label="Konto anonymisieren nach x Tagen"
                persistent-hint
                type="number"
                v-model="anonymizeAccountOnInactivityAfterDays"
              />
            </ValidationProvider>
          </v-col>
        </v-row>
      </template>

      <template :close="close" v-slot:actions="{ close }">
        <btn-cancel @cancel="close"/>
        <v-spacer/>
        <btn-submit :disabled="invalid" @submit="submit(close)" label="Lokale Benutzerauthentifizierung hinzufügen"/>
      </template>
    </kit-dialog>
  </ValidationObserver>
</template>

<script>

  export default {
    data: () => ({
      isFormValid: false,
      name: null,
      passwordExpiresInDays: 30,
      anonymizeAccountOnInactivityAfterDays: 365,
      formRules: {
        name: {
          required: true,
          min: 4,
        },
        passwordExpiresInDays: {
          required: true,
          min_value: -1,
        },
        anonymizeAccountOnInactivityAfterDays: {
          required: true,
          min_value: -1,
        },
      }
    }),

    methods: {
      submit(close) {
        const payload = {
          type: 'local',
          provider: {
            name: this.name,
            passwordExpiresInDays: this.passwordExpiresInDays,
            anonymizeAccountOnInactivityAfterDays: this.anonymizeAccountOnInactivityAfterDays,
          }
        }

        this.$emit('add', payload)
        close()
      },
    },
  }
</script>
