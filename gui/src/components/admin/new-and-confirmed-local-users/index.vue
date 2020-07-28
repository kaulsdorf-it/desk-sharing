<template>
  <v-container fluid>
    <v-row>
      <v-col cols="2">
        <v-list class="elevation-1">
          <v-subheader>Neue lokale Benutzer</v-subheader>
          <v-divider/>
          <v-list-item
            :key="user._id"
            @click="selectedUser = user"
            v-for="user of users"
          >
            <v-list-item-content>
              <v-list-item-title>{{ `${user.firstName} ${user.lastName}` }}</v-list-item-title>
              <v-list-item-subtitle>{{ user.mail }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon>mdi-chevron-right</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-col>

      <v-col cols="9">
        <manage-user
          :authProviderId="authProviderId"
          :item="selectedUser"
          @close="selectedUser = null"
          v-if="selectedUser"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import ManageUser from './manage-user'

  export default {
    components: {
      ManageUser,
    },

    computed: {
      ...mapGetters({
        users: 'users/getUsersNotYetCleared',
        authProviders: 'serverConfig/getAuthProviders',
      }),
      authProviderId() {
        return this.authProviders.find(i => i.type === 'local')._id
      },
    },

    created() {
      this.load()
      this.loadUserRoles()
    },

    data: () => ({
      selectedUser: null,
    }),

    methods: {
      ...mapActions({
        load: 'users/loadAction',
        loadUserRoles: 'users/loadUserRolesAction',
      })
    }
  }
</script>
