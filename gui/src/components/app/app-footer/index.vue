<template>
  <v-footer :color="isConnected ? 'blue-grey darken-1' : 'error lighten-4'" app class="pl-2 pr-2" dark style="height: 36px">
    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <v-icon
          :color="isConnected ? 'success lighten-4' : 'error darken-1'"
          class="pr-3"
          size="30"
          style="position: relative; top: -3px;"
          v-on="on"
        >
          {{ isConnected ? 'mdi-cloud-check' : 'mdi-cloud-off-outline' }}
        </v-icon>
      </template>
      <span>
        <v-icon left size="20">mdi-check</v-icon>
        Sie sind {{ isConnected ? '' : 'NICHT ' }}mit dem FORMS Server verbunden.
      </span>
    </v-tooltip>

    <v-spacer/>

    <v-tooltip top v-if="isAdmin">
      <template v-slot:activator="{ on }">
          <span class="pr-8 pl-8" v-on="on">
            <v-icon class="pb-1" color="success lighten-4" left>account_circle</v-icon>
            <span class="pl-1">Admin</span>
          </span>
      </template>
      <span>
        Sie sind Administrator
      </span>
    </v-tooltip>

    <template v-if="userIsLoggedIn">
          <span>
            <v-icon class="pb-1" color="success lighten-4" left>mdi-account</v-icon>
            <span v-if="userIsLoggedIn">{{ user.firstName }} {{ user.lastName }} @{{ authProviderTypeOfCurrentUser }}</span>
          </span>
    </template>
  </v-footer>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters({
        accessRights: 'login/accessRights',
        userIsLoggedIn: 'login/userIsLoggedIn',
        serverConfig: 'serverConfig/getConfig',
        isConnected: 'app/isConnected',
      }),
      authProviderTypeOfCurrentUser() {
        if (this.serverConfig && this.user && this.serverConfig.authProviders) {
          const provider = this.serverConfig.authProviders.find(i => i._id === this.user.authProviderId)
          return provider.provider.name.toUpperCase() || '---'
        }
        return ''
      }
    },
  }
</script>

<style scoped>
  .mini-col {
    padding: 0px 14px !important;
  }

  .mini-col span {
    font-weight: bold;
  }
</style>
