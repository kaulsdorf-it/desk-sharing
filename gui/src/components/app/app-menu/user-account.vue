<template>
  <v-toolbar-items>
    <v-menu offset-y open-on-hover v-if="isSignedIn">
      <template v-slot:activator="{ on }">
        <v-btn text v-on="on">
          <v-icon>mdi-account-circle-outline</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click.stop="logout">
          <v-list-item-action>
            <v-icon>mdi-logout-variant</v-icon>
          </v-list-item-action>
          <v-list-item-title>Abmelden</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <template v-else-if="thisIsNotRouteLogin">
      <v-btn :to="{ name: 'login' }" id="v-step-sign-in-btn" text>
        Anmelden
      </v-btn>
    </template>
  </v-toolbar-items>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    computed: {
      thisIsNotRouteLogin() {
        return this.$route.name !== 'login'
      }
    },

    methods: {
      ...mapActions({
        logout: 'login/logout',
      }),
    },
  }
</script>
