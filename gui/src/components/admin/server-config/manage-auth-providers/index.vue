<template>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { mixin } from '../mixin'
  import Ldap from './ldap'
  import AddLdap from './ldap/add'

  import Saml2Idp from './saml-2-idp'

  import Local from './local'
  import AddLocal from './local/add'

  export default {
    components: {
      AddLdap,
      AddLocal,
    },

    computed: {
      ...mapGetters({}),
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

    mixins: [mixin],

    watch: {
      config(config) {
        this.authProviders = config ? config.authProviders : []
      }
    }
  }
</script>
