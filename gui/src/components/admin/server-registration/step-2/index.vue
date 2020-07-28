<template>
  <ValidationObserver v-slot="{ invalid }">
    <v-stepper-content :test="setFormValidity(!invalid)" step="2" style="height: calc(100vh - 397px); overflow-y: auto;">
      <v-row>
        <v-col cols="6">
          <ValidationProvider :rules="rules().serviceName" name="Die Bezeichnung" v-slot="{ errors, validate }">
            <v-text-field
              :error-messages="errors"
              @keyup="validate"
              filled
              hint="Geben Sie diesem FORMS-Servers eine Bezeichnung"
              label="Bezeichnung"
              persistent-hint
              v-model="serviceName"
            />
          </ValidationProvider>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="6">
          <ValidationProvider :rules="rules().hostName" name="Host Name" v-slot="{ errors, validate }">
            <v-text-field
              :error-messages="errors"
              @keyup="validate"
              hint="Wie wird dieser FORMS-Server intern wie ggf. extern erreichbar sein?"
              label="URL des FORMS-Servers"
              outlined
              persistent-hint
              v-model="hostName"
            />
          </ValidationProvider>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="6">
          <ValidationProvider :rules="rules().registryServerUrl" name="Die Registry Url" v-slot="{ errors, validate }">
            <v-text-field
              :append-outer-icon="statusIcon"
              :color="statusColor"
              :error-messages="getErrors(errors)"
              @click:append-outer="checkUrl"
              @keydown="event => onInputChange(event, validate)"
              @keyup="validate"
              hint="Url der zentralen FORMS-Registry dieses Unternehmens / dieser Organisation"
              label="Registry Url"
              outlined
              persistent-hint
              v-model="registryServerUrl"
            />
          </ValidationProvider>
        </v-col>

        <v-col class="pt-7" cols="5">
          <span v-if="statusIcon && checkHostNameResult !== true">&lt;-- Hier klicken, um die Url zu testen</span>
        </v-col>
      </v-row>
    </v-stepper-content>
  </ValidationObserver>
</template>

<script>
  import { mapActions, mapGetters, mapMutations } from 'vuex'
  import { mixin } from '../mixin'
  import { stepMixin } from '../step-mixin'

  export default {
    computed: {
      ...mapGetters({
        checkHostNameResult: 'serverConfig/checkHostNameResult',
      }),
      serviceName: {
        get() {
          return this.config ? this.config.serviceName : null
        },
        set(value) {
          this.setConfigValue({ name: 'serviceName', value })
        }
      },
      registryServerUrl: {
        get() {
          return this.config ? this.config.registryServerUrl : null
        },
        set(value) {
          this.setConfigValue({ name: 'registryServerUrl', value })
        }
      },
      hostName: {
        get() {
          return this.config ? this.config.hostName : null
        },
        set(value) {
          this.setConfigValue({ name: 'hostName', value })
        }
      },
      statusIcon() {
        switch (this.checkHostNameResult) {
          case true:
            return 'mdi-check-circle'
          case false:
            return 'cancel'
          default:
            return this.registryServerUrl && this.registryServerUrl.length > 4
              ? 'mdi-test-tube'
              : null
        }
      },
      statusColor() {
        switch (this.checkHostNameResult) {
          case true:
            return 'success'
          case false:
            return 'error'
          case null:
            return 'warning'
          default:
            return 'error'
        }
      },
    },

    data() {
      return {
        checkResult: null,
      }
    },

    methods: {
      ...mapActions({
        checkRegistryServerUrl: 'serverConfig/checkRegistryServerUrlAction',
      }),
      ...mapMutations({
        resetCheckRegistryServerUrl: 'serverConfig/resetCheckRegistryServerUrlMutation',
      }),
      onInputChange(event, validate) {
        if (event.code === 'Enter') {
          this.checkUrl()
          event.preventDefault()
        } else {
          validate()
          this.resetCheckRegistryServerUrl()
        }
      },
      rules() {
        return {
          registryServerUrl: {
            required: true,
            min: 5,
            is: this.checkHostNameResult !== false ? this.registryServerUrl : null
          },
          hostName: {
            required: true,
            min: 5,
          },
          serviceName: {
            required: true,
            min: 5,
          },
        }
      },
      getErrors(errors) {
        if (errors.length > 0) {
          return errors
        }

        if (this.registryServerUrl && this.registryServerUrl.length > 4 && this.checkHostNameResult === null) {
          return []
        }

        if (this.checkHostNameResult === 'CANNOT_CONNECT_TO_HOST') {
          return ['Kein Server erreicht unter dieser Url!']
        }

        if (this.checkHostNameResult === 'HOST_IS_NOT_A_FORMS_REGISTRY') {
          return ['Keine FORMS-Registry erreichbar unter dieser Url!']
        }

        return []
      },
      checkUrl() {
        if (this.registryServerUrl && this.registryServerUrl.length >= 5) {
          this.checkRegistryServerUrl(this.registryServerUrl)
        }
      },
    },

    mixins: [mixin, stepMixin],
  }
</script>
