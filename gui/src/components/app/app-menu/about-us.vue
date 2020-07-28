<template>
  <v-menu
    :close-on-click="false"
    :close-on-content-click="true"
    offset-y
    open-on-hover
    v-model="menu"
  >
    <template v-slot:activator="{ on }">
      <v-btn color="info" text v-on="on">
        <v-icon>mdi-information-outline</v-icon>
      </v-btn>
    </template>
    <v-list dense>
      <v-list-item :to="{ name: 'about-us' }" v-if="serverIsRegistered">
        <v-list-item-content>
          <v-list-item-title>Über Uns</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item :to="{ name: 'about-forms' }">
        <v-list-item-content>
          <v-list-item-title>Über FORMS</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters({
        serverIsRegistered: 'serverConfig/serverIsRegistered',
      }),
    },

    data: () => ({
      menu: false,
    }),
  }
</script>
