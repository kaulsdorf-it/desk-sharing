<template>
  <v-container fill-height>
    <v-layout align-center justify-center>
      <v-flex xs5>
        <template v-if="checkingChangePasswordRequest">
          <v-overlay
            :absolute="true"
            :value="true"
            opacity="0.2"
          >
            <div color="transparent">
              <v-progress-circular
                :size="200"
                :width="10"
                color="primary"
                indeterminate
              >
                Token wird geprüft...
              </v-progress-circular>
            </div>
          </v-overlay>
        </template>

        <template v-else>
          <ValidationObserver ref="observer" tag="form" v-if="canChangePassword" v-slot="{ invalid }">
            <v-card>
              <v-toolbar color="info" dark dense>
                <v-toolbar-title>Neues Kennwort</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-row>
                  <v-col cols="6">
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
                  <v-col cols="6">
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
              </v-card-text>

              <v-divider/>
              <v-card-actions class="grey lighten-3">
                <btn-cancel @cancel="close"/>
                <v-spacer/>
                <btn-submit :disabled="invalid" @submit="submit" label="Kennwort speichern"/>
              </v-card-actions>
            </v-card>
          </ValidationObserver>

          <v-card tile type="error" v-else>
            <v-toolbar color="error" dark dense>
              <v-toolbar-title>Token abgelaufen</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              Ihre Anfrage zur Änderung des Kennworts ist abgelaufen.
            </v-card-text>
            <v-divider/>
            <v-card-actions>
              <v-spacer/>
              <forgotten-password btnLabel="Erneut anfragen, um das Kennwort zu ändern"/>
              <v-spacer/>
            </v-card-actions>
          </v-card>
        </template>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import ForgottenPassword from './forgotten-password'

  export default {
    components: {
      ForgottenPassword,
    },

    computed: {
      ...mapGetters({
        getChangePasswordRequest: 'login/getChangePasswordRequest',
      }),
      checkingChangePasswordRequest() {
        const changePasswordRequest = this.getChangePasswordRequest(this.$route.params.token)
        return changePasswordRequest && changePasswordRequest.result === null
      },
      canChangePassword() {
        const changePasswordRequest = this.getChangePasswordRequest(this.$route.params.token)
        return changePasswordRequest && changePasswordRequest.result === true
      }
    },

    created() {
      this.checkNewPasswordRequestToken(this.$route.params.token)
    },

    data: () => ({
      password: null,
      confirmPassword: null,
    }),

    methods: {
      ...mapActions({
        checkNewPasswordRequestToken: 'login/checkNewPasswordRequestTokenAction',
        setNewPassword: 'login/setNewPasswordAction',
      }),
      submit() {
        this.showToast({
          color: 'success',
          text: `Ihr Kennwort wurde geändert und kann ab sofort verwendet werden.`,
        })
        this.setNewPassword({ token: this.$route.params.token, password: this.password })
        this.close()
      },
      close() {
        this.$router.replace({ name: 'login' })
      }
    },
  }
</script>
