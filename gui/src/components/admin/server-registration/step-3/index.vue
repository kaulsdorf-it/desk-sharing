<template>
  <ValidationObserver v-slot="{ invalid }">
    <v-stepper-content :step="step" :test="setFormValidity(!invalid)" style="height: calc(100vh - 397px); overflow-y: auto;">
      <div class="title">Authentifizierungsservice(s) konfigurieren</div>
      <div class="subtitle-2 pb-4">Mindestens ein (1) Authentifizierungsservice wird benötigt</div>
      <div class="pb-4">
        <add-ldap @add="addProvider"/>
        <add-local @add="addProvider" v-if="!authProviders.find(ap => ap.type === 'local')"/>
      </div>
      <v-row>
        <v-col :key="idx" cols="6" v-for="(authProvider, idx) of authProviders">
          <component :authProvider="authProvider" :is="getProvider(authProvider.type)"/>
        </v-col>
      </v-row>
    </v-stepper-content>

    <ValidationProvider rules="min_value:1" v-slot="{ errors, validate }">
      <v-text-field
        :error-messages="errors"
        :value="authProviders.length"
        @keyup="validate"
        type="number"
        v-if="authProviders"
        v-show="false"
      />
    </ValidationProvider>

  </ValidationObserver>
</template>

<script>
  import { mixin } from '../mixin'
  import Ldap from './ldap'
  import AddLdap from './ldap/add'

  import Saml2Idp from './saml-2-idp'

  import Local from './local'
  import AddLocal from './local/add'
  import { stepMixin } from '../step-mixin'

  export default {
    components: {
      AddLdap,
      AddLocal,
    },

    created() {
      this.authProviders = this.config ? this.config.authProviders : []
    },

    data() {
      return {
        authProviders: [],
        providerOptions: [
          { text: 'LDAP', value: 'ldap' },
          { text: 'SSO (SAML 2)', value: 'saml-2-idp' },
        ]
      }
    },

    methods: {
      getProvider(providerType) {
        switch (providerType) {
          case 'ldap':
            return Ldap
          case 'local':
            return Local
          case 'saml-2-idp':
            return Saml2Idp
        }
      },
      addProvider(provider) {
        this.authProviders.push(provider)
        this.setConfigValue({ name: 'authProviders', value: this.authProviders })
      },
    },

    mixins: [mixin, stepMixin],

    watch: {
      config(config) {
        this.authProviders = config ? config.authProviders : []
      }
    }
  }
</script>
