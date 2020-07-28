<template>
  <v-card class="elevation-15">
    <v-toolbar :class="{ 'warning darken-3': loginError !== null, primary: loginError === null }" dark dense>
      <v-toolbar-title>Anmelden</v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <v-alert
        border="right"
        color="warning darken-3"
        colored-border
        elevation="1"
        type="error"
        v-if="!!loginError"
      >
        <span v-html="loginErrorMsg"/>
      </v-alert>

      <div class="subtitle-2 pb-4">{{ authProvider.provider.name }}</div>

      <v-form>
        <v-text-field
          @input="inputValueHasChanged"
          @keydown.enter="signIn"
          autocomplete="username"
          filled
          label="Anmeldename"
          placeholder="Anmeldename"
          v-model="accountName"
        />
        <v-text-field
          @input="inputValueHasChanged"
          @keydown.enter="signIn"
          autocomplete="current-password"
          filled
          id="password"
          label="Kennwort"
          placeholder="Kennwort"
          type="password"
          v-model="password"
        />
      </v-form>
      <!--      <v-btn color="warning" small text>Anmeldename vergessen?</v-btn>-->
      <forgotten-password/>
    </v-card-text>

    <v-divider/>

    <v-card-actions class="grey lighten-3">
      <v-btn @click="back" small text>
        <v-icon left v-if="showLinkBack">mdi-chevron-left</v-icon>
        Zurück
      </v-btn>
      <v-spacer/>
      <local-register-user :authProvider="authProvider"/>
      <v-spacer/>
      <btn-submit
        :disabled="!loginBtnEnabled"
        @submit="signIn"
        label="Anmelden"
      />
    </v-card-actions>

    <v-overlay
      :value="loginInProgress"
      absolute
    >
      <v-progress-circular
        :size="200"
        :width="10"
        color="primary"
        indeterminate
      />
    </v-overlay>
  </v-card>
</template>

<script>
  import { mapActions, mapGetters, mapMutations } from 'vuex'
  import { mixin } from '../mixin'
  import ForgottenPassword from './forgotten-password'
  import LocalRegisterUser from './sign-up'

  export default {
    components: {
      ForgottenPassword,
      LocalRegisterUser,
    },

    computed: {
      ...mapGetters({
        loginError: 'login/getLoginError',
        loginInProgress: 'login/getLoginInProgress',
      }),
      loginBtnEnabled() {
        return !this.loginError
      },
      loginErrorMsg() {
        switch (this.loginError) {
          case 'WRONG USER STATUS: unconfirmed':
            return 'Sie müssen erst Sie Ihre Anmeldung bei FORMS bestätigen!<br/><br/>Wir haben Ihnen dazu eine E-Mail gesandt.'
          case 'WRONG USER STATUS: confirmed by applicant':
            return 'Ihr Benutzerkonto wurde noch nicht freigeschaltet.<br/><br/>Bitte versuchen Sie es später / morgen noch einmal!'
          case 'WRONG USER STATUS: inactive':
            return 'Ihr Benutzerkonto wurde deaktiviert / gelöscht.'
          case 'NO USER OR WRONG PASSWORD':
          case 'WRONG PASSWORD':
            return 'Anmeldename oder Kennwort falsch!'
          case 'NO AUTH PROVIDER FOUND':
          case 'NO AUTH PROVIDER FOUND FOR THIS TYPE':
            return 'Für Ihr Benutzerkonto konnte kein Anmeldedienst gefunden werden.'
          case 'USER_ACCOUNT_ALREADY_EXISTS':
            return 'Der ausgewählte Anmeldename gehört bereits zu einem anderen Benutzerkonto. Haben Sie vielleicht mehrfach versucht, sich zu registrieren?'
          default:
            return 'Es ist ein unbekannter Fehler aufgetreten.<br/><br/>' + this.loginError
        }
      }
    },

    created() {
      this.reLogin(this.$socket)
    },

    data() {
      return {
        accountName: '',
        password: ''
      }
    },

    methods: {
      ...mapActions({
        login: 'login/login',
        reLogin: 'login/reLogin'
      }),
      ...mapMutations({
        resetErrorMutation: 'login/resetErrorMutation',
      }),
      signIn() {
        const payload = {
          providerId: this.authProvider._id,
          payload: {
            accountName: this.accountName,
            password: this.password
          }
        }

        this.login(payload)
        this.inputValueHasChanged()
      },
      inputValueHasChanged() {
        this.resetErrorMutation()
      }
    },

    mixins: [mixin],
  }
</script>
