<template>
  <v-container fill-height fluid>
    <v-layout align-center justify-center>
      <v-flex id="sign-in-form" xs12 sm8 md6 lg4>
        <v-card class="elevation-15" v-if="!selectedAuthProvider">
          <v-toolbar class="primary" dark dense>
            <v-toolbar-title>Wie wollen Sie sich sich anmelden?</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-subheader>Auswahl:</v-subheader>
            <v-list>
              <v-divider/>
              <template v-for="authProvider of authProviders">
                <v-list-item :key="authProvider._id" @click="selectedAuthProvider = authProvider">
                  {{ authProvider.provider.name }} ({{ authProvider.type.toUpperCase() }})
                </v-list-item>
                <v-divider :key="authProvider._id + '-divider'"/>
              </template>
            </v-list>
          </v-card-text>
        </v-card>

        <component
          :authProvider="selectedAuthProvider"
          :is="loginComponent"
          :showLinkBack="this.authProviders.length > 1"
          @back="selectedAuthProvider = null"
          v-else
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex'
  import LdapLogin from './providers/ldap'
  import Local from './providers/local'

  export default {
    computed: {
      ...mapGetters({
        authProviders: 'login/getAuthProviders',
      }),
      loginComponent() {
        switch (this.selectedAuthProvider.type) {
          case 'ldap':
            return LdapLogin
          case 'local':
            return Local
        }
      },
    },

    created() {
      if (this.authProviders.length === 1) {
        this.selectedAuthProvider = this.authProviders[0]
      }
    },

    data() {
      return {
        selectedAuthProvider: null,
      }
    },

    watch: {
      authProviders(authProviders) {
        if (authProviders.length === 1) {
          this.selectedAuthProvider = authProviders[0]
        }
      }
    }
  }
</script>
