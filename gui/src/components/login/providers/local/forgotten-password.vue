<template>
  <ValidationObserver ref="observer" tag="form" v-slot="{ invalid }">
    <kit-dialog
      headerBgColor="info"
      persistent
      scrollable
      title="Neues Kennwort"
      width="600"
    >
      <template v-slot:activatorBtn="{ open }">
        <v-btn
          @click="open"
          color="warning"
          small
          text
        >
          {{ btnLabel }}
        </v-btn>
      </template>

      <template slot="content">
        <div class="subtitle-2 mt-8 pa-2 rounded" type="info">
          <span class="subtitle-1">Wir senden Ihnen umgehend eine E-Mail mit einem Link zu.</span>
          <br/>
          Dieser Link führt Sie zur Seite, auf der Sie ein neues Kennwort eingeben können.
          <br/>
          <br/>
          Der Link ist zwei Tage gültig.
        </div>

        <ValidationProvider name="E-Mail" rules="required|email" v-slot="{ errors, validate }">
          <v-text-field
            :error-messages="errors"
            @keyup="validate"
            class="mt-8"
            clearable
            color="primary"
            filled
            hint="E-Mail-Adresse, die Sie für Ihr Benutzerkonto verwenden"
            label="E-Mail-Adresse"
            persistent-hint
            v-model="mail"
          />
        </ValidationProvider>
      </template>

      <template :close="close" v-slot:actions="{ close }">
        <btn-cancel @cancel="close"/>
        <v-spacer/>
        <btn-submit :disabled="invalid" @submit="submit(close)" label="E-Mail senden"/>
      </template>
    </kit-dialog>
  </ValidationObserver>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    data: () => ({
      mail: null,
    }),

    methods: {
      ...mapActions({
        requestForgottenPasswordMail: 'login/requestForgottenPasswordMailAction',
      }),
      submit(close) {
        this.showToast({
          color: 'info',
          text: `Die E-Mail an <b>${this.mail}</b> ist unterwegs.`,
        })
        this.requestForgottenPasswordMail(this.mail)
        close()
      },
    },

    props: {
      btnLabel: {
        type: String,
        default: 'Kennwort vergessen?',
      }
    }
  }
</script>
