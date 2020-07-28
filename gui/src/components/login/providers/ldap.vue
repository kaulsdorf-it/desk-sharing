<template>
  <v-card class="elevation-15">
    <v-toolbar :class="{ 'warning darken-3': loginError !== null, primary: !loginError }" dark dense>
      <v-toolbar-title>Anmelden</v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <v-alert
        :value="!!loginError"
        border="right"
        color="warning darken-3"
        colored-border
        elevation="1"
        type="error"
      >
        Anmeldename oder Kennwort falsch
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
    </v-card-text>

    <v-divider/>

    <v-card-actions class="grey lighten-3">
      <v-btn @click="back" small text>
        <v-icon left v-if="showLinkBack">mdi-chevron-left</v-icon>
        Zurück
      </v-btn>
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
  import { mixin } from './mixin'

  export default {
    computed: {
      ...mapGetters({
        loginError: 'login/getLoginError',
        loginInProgress: 'login/getLoginInProgress',
      }),
      loginBtnEnabled() {
        return !this.loginError
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
