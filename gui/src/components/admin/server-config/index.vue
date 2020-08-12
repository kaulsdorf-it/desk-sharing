<template>
  <v-container>
    <v-card>
      <v-card-title>Authentifizierungsservice(s) konfigurieren</v-card-title>
      <v-card-text>
        <p>
          Mindestens ein (1) Authentifizierungsservice wird benötigt
        </p>
      </v-card-text>

      <v-divider/>

      <v-card-text style="height: calc(100vh - 300px); overflow-y: auto">
        <v-row>
          <v-col :key="idx" cols="6" v-for="(authProvider, idx) of authProviders">
            <component :authProvider="authProvider" :is="getProvider(authProvider.type)"/>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider/>

      <v-card-actions class="grey lighten-3">
        <add-ldap @add="addProvider"/>
        <add-local @add="addProvider" v-if="!authProviders.find(ap => ap.type === 'local')"/>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import AddLdap from './manage-auth-providers/ldap/add/index'
  import AddLocal from './manage-auth-providers/local/add/index'
  import Ldap from './manage-auth-providers/ldap/index'
  import Local from './manage-auth-providers/local/index'
  import Saml2Idp from './manage-auth-providers/saml-2-idp/index'

  export default {
    components: {
      AddLdap,
      AddLocal,
    },

    computed: {
      ...mapGetters({
        currentAuthProviders: 'serverConfig/getAuthProviders',
      }),
    },

    created() {
      this.init()
    },

    data: () => ({
      authProviders: [],
    }),

    methods: {
      ...mapActions({}),
      init() {
        this.authProviders = JSON.parse(JSON.stringify(this.currentAuthProviders))
      },
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
        // this.setConfigValue({ name: 'authProviders', value: this.authProviders })
      },
    },
  }
</script>
