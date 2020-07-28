<template>
  <v-container fluid v-if="usersHaveBeenLoaded === true">
    <v-row>
      <v-col cols="3">
        <v-card>
          <v-card-text>
            <v-combobox
              :filter="filterUsers"
              :items="usersWithAuthProvider"
              :search-input.sync="search"
              @change="routeToUser"
              class="no-flex-down-here"
              clearable
              hide-selected
              item--text="firstName"
              item-value="_id"
              label="Benutzer suchen.."
              v-model="selectedUser"
            >
              <template v-slot:item="{ item }">
                <v-list-item-content>
                  <v-list-item-title v-html="textHighlight(`${item.firstName} ${item.lastName}`, search)"/>
                  <v-list-item-subtitle>
                    <v-icon left size="16">mdi-account</v-icon>
                    <span v-html="`${ item.accountName }@${ item.authProvider.nameAndType }`"/>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    <v-icon left size="16">mail</v-icon>
                    {{item.mail}}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </template>
              <template v-slot:selection="{ item }">
                <v-list-item-content>
                  <v-list-item-title v-html="`${item.firstName} ${item.lastName}`"/>
                  <v-list-item-subtitle>
                    <v-icon left size="16">mdi-account</v-icon>
                    <span v-html="`${ item.accountName }@${ item.authProvider.nameAndType }`"/>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    <v-icon left size="16">mail</v-icon>
                    {{item.mail}}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </template>
            </v-combobox>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="9">
        <router-view/>
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
        usersWithAuthProvider: 'users/getUsersWithAuthProvider',
        usersHaveBeenLoaded: 'users/usersHaveBeenLoaded',
        serverConfig: 'serverConfig/getConfig',
      }),
    },

    created() {
      this.loadUsers()
      this.loadUserStatus()
      this.loadUserRoles()
      if (this.$route.params && this.usersWithAuthProvider.length > 0) {
        this.selectedUser = this.usersWithAuthProvider.find(user => user._id === this.$route.params.userId)
      }
    },

    data: () => ({
      search: '',
      selectedUser: null,
    }),

    methods: {
      ...mapActions({
        loadUserStatus: 'users/loadUserStatusAction',
        loadUserRoles: 'users/loadUserRolesAction',
        loadUsers: 'users/loadAction',
      }),
      filterUsers(user) {
        return `${user.firstName.toLowerCase()}${user.lastName.toLowerCase()}`.indexOf(this.search.toLowerCase()) !== -1
      },
      routeToUser(user) {
        let target

        if (user) {
          target = {
            name: 'manage-user',
            params: {
              userName: `${user.firstName}+${user.lastName}`,
              userId: user._id,
            }
          }
        } else {
          target = {
            name: 'manage-users'
          }
        }

        this.$router.push(target)
      }
    },

    watch: {
      '$route.name'(routeName) {
        if (routeName === 'manage-users') {
          this.selectedUser = null
        }
      },

      usersWithAuthProvider() {
        if (this.$route.params && !this.selectedUser) {
          this.selectedUser = this.usersWithAuthProvider.find(user => user._id === this.$route.params.userId)
        }
      },
    }
  }
</script>

<style>
  .no-flex-down-here .v-list-item__content {
    flex: none;
  }
</style>
