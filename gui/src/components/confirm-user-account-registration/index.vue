<template>
  <v-container fill-height fluid>
    <v-layout align-center justify-center>
      <v-flex id="sign-in-form" xs3>
        <v-progress-circular
          :size="170"
          color="primary"
          indeterminate
          v-if="isConfirmUserAccountStateRunning === true"
        >
          Bestätigung läuft...
        </v-progress-circular>

        <v-alert :value="!!getErrorMsg" type="error">{{ getErrorMsg }}</v-alert>

        <v-alert type="success" v-if="isConfirmUserAccountStateRunning === false">
          <template v-if="confirmedAccount.status === 'confirmed by applicant'">
            Danke für die Bestätigung Ihres Benutzerkontos!
            <br/>
            <br/>
            Sobald ein Administrator Ihre Angaben überprüft und Ihr Benutzerkonto freigeschalten hat, können Sie FORMS verwenden.
            <br/>
            Wir benachichtigen Sie per E-Mail, sobald die Freischaltung erfolgt ist.
          </template>
          <template v-else-if="confirmedAccount.status === 'active'">
            Danke für die Bestätigung Ihres Benutzerkontos!
            <br/>
            <br/>
            Sie können FORMS jetzt verwenden.
          </template>
        </v-alert>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters({
        isConnected: 'app/isConnected',
        isConfirmUserAccountStateRunning: 'users/isConfirmUserAccountStateRunning',
        getConfirmUserAccountError: 'users/getConfirmUserAccountError',
        confirmedAccount: 'users/getConfirmedAccount',
      }),
      getErrorMsg() {
        switch (this.getConfirmUserAccountError) {
          case 'USER HAS BEEN DEACTIVATED':
            return 'Ihr Benutzerkonto wurde deaktiviert.'

          default:
            return null
        }
      }
    },

    created() {
      if (this.isConnected) {
        this.confirmUserAccount(this.$route.params.userAccountId)
      }
    },

    methods: {
      ...mapActions({
        confirmUserAccount: 'users/confirmUserAccountAction',
      }),
    },

    watch: {
      isConnected(data) {
        if (data) {
          this.confirmUserAccount(this.$route.params.userAccountId)
        }
      }
    }
  }
</script>
