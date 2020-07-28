<template>
  <ValidationObserver ref="observer" v-slot="{ invalid, errors }">
    <kit-dialog
      persistent
      scrollable
      title="Registrierung"
      width="800"
    >
      <template v-slot:activatorBtn="{ open }">
        <v-btn
          @click="open"
          color="primary"
          text
        >
          Neu Registrieren
        </v-btn>
      </template>

      <template slot="content">
        <form>
          <v-row class="pt-4">
            <v-col cols="4">
              <ValidationProvider :rules="formRules.accountName" name="Benutzername" v-slot="{ errors, validate }" vid="accountName">
                <v-text-field
                  :error-messages="errors"
                  @keyup="validate"
                  autocomplete="username"
                  dense
                  label="Benutzername"
                  v-model="accountName"
                />
              </ValidationProvider>
            </v-col>
            <v-col cols="4">
              <ValidationProvider
                name="Kennwort"
                rules="required|min:8|confirmed:confirmPassword"
                v-slot="{ errors, validate }"
                vid="password"
              >
                <v-text-field
                  :error-messages="errors"
                  @keyup="validate"
                  autocomplete="new-password"
                  dense
                  label="Kennwort"
                  type="password"
                  v-model="password"
                />
              </ValidationProvider>
            </v-col>
            <v-col cols="4">
              <ValidationProvider
                name="Kennwort bestätigen"
                rules="required"
                v-slot="{ errors, validate }"
                vid="confirmPassword"
              >
                <v-text-field
                  :error-messages="errors"
                  @keyup="validate"
                  autocomplete="new-password"
                  dense
                  label="Kennwort bestätigen"
                  type="password"
                  v-model="confirmPassword"
                />
              </ValidationProvider>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6">
              <ValidationProvider name="Vorname" rules="required" v-slot="{ errors, validate }">
                <v-text-field
                  :error-messages="errors"
                  @keyup="validate"
                  label="Vorname"
                  v-model="firstName"
                />
              </ValidationProvider>
            </v-col>
            <v-col cols="6">
              <ValidationProvider name="Nachname" rules="required" v-slot="{ errors, validate }">
                <v-text-field
                  :error-messages="errors"
                  @keyup="validate"
                  label="Nachname"
                  v-model="lastName"
                />
              </ValidationProvider>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6">
              <ValidationProvider :rules="formRules.mail" name="E-Mail" v-slot="{ errors, validate }">
                <v-text-field
                  :error-messages="errors"
                  @keyup="validate"
                  label="E-Mail-Adresse"
                  v-model="mail"
                />
              </ValidationProvider>
            </v-col>
          </v-row>
        </form>
      </template>

      <template :close="close" v-slot:actions="{ close }">
        <btn-cancel @cancel="close"/>
        <v-spacer/>
        <btn-submit @submit="submit(close)" label="Registrierung absenden"/>
      </template>
    </kit-dialog>
  </ValidationObserver>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    computed: {
      formRules() {
        return {
          accountName: {
            required: true,
            min: 8,
            accountNameMustNotExist: {
              authProviderId: this.authProvider._id,
            },
          },
          mail: {
            required: true,
            email: true,
            mailMustNotExistInUserAccount: {
              authProviderId: this.authProvider._id,
            },
            mailDomainMustExist: true,
          }
        }
      }
    },

    data: () => ({
      accountName: null,
      password: null,
      confirmPassword: null,
      firstName: null,
      lastName: null,
      mail: null,
    }),

    methods: {
      ...mapActions({
        registerNewUser: 'users/registerNewUserAction',
      }),
      submit(close) {
        const payload = {
          accountName: this.accountName,
          password: this.password,
          firstName: this.firstName,
          lastName: this.lastName,
          mail: this.mail,
          authProviderId: this.authProvider._id,
        }

        this.registerNewUser(payload)
        close()
      }
    },

    props: {
      authProvider: {
        type: Object,
        required: true,
      },
    },
  }
</script>
