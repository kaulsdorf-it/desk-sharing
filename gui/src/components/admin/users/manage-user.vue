<template>
  <form>
    <ValidationObserver v-slot="{ invalid }">
      <v-card v-if="usersHaveBeenLoaded === true">
        <v-toolbar color="info" dark dense>
          <v-toolbar-title><b>{{ accountName }}</b>@{{ authProviderName }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form>
            <v-row>
              <v-col cols="2">
                <ValidationProvider name="Vorname" rules="required|min:3" v-slot="{ errors, validate }">
                  <v-text-field
                    :disabled="!isLocalUser"
                    :error-messages="errors"
                    @keyup="validate"
                    label="Vorname"
                    v-model="firstName"
                  />
                </ValidationProvider>
              </v-col>

              <v-col cols="2">
                <ValidationProvider name="Nachname" rules="required|min:3" v-slot="{ errors, validate }">
                  <v-text-field
                    :disabled="!isLocalUser"
                    :error-messages="errors"
                    @keyup="validate"
                    label="Nachname"
                    v-model="lastName"
                  />
                </ValidationProvider>
              </v-col>

              <v-col cols="3">
                <v-select
                  :items="userStatusObjects"
                  item-text="text"
                  item-value="status"
                  label="Status"
                  v-model="status"
                >
                  <template v-slot:item="{ item }">
                    <v-list-item-avatar>
                      <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>{{ item.text }}</v-list-item-title>
                    </v-list-item-content>
                  </template>
                </v-select>
              </v-col>

              <v-col cols="3">
                <ValidationProvider :rules="rules.mail" name="E-Mail" v-slot="{ errors, validate }">
                  <v-text-field
                    :disabled="!isLocalUser"
                    :error-messages="errors"
                    @keyup="validate"
                    label="E-Mail"
                    v-model="mail"
                  />
                </ValidationProvider>
              </v-col>

              <v-col cols="12">
                <v-select
                  :items="userRolesObjects"
                  deletable-chips
                  item-text="text"
                  item-value="role"
                  label="Mitglied in den Gruppen"
                  multiple
                  small-chips
                  v-model="roles"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider/>

        <v-card-actions class="grey lighten-3">
          <v-spacer/>
          <btn-cancel/>
          <btn-submit :disabled="invalid" @submit="submit"/>
        </v-card-actions>
      </v-card>
    </ValidationObserver>
  </form>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters({
        getUserById: 'users/getById',
        userStatus: 'users/getStatus',
        userRoles: 'users/getRoles',
        usersHaveBeenLoaded: 'users/usersHaveBeenLoaded',
        userRolesObjects: 'users/getUserRolesObjects',
      }),
      userStatusObjects() {
        return this.userStatus.map(status => {
          let text = ''
          let icon = ''
          switch (status) {
            case 'active':
              text = 'Freigeschaltet'
              icon = 'mdi-check'
              break
            case 'unconfirmed':
              text = 'Konto muss vom Inhaber bestätigt werden'
              icon = 'mdi-checkbox-blank-outline'
              break
            case 'confirmed by applicant':
              text = 'Konto vom Inhaber bestätigt'
              icon = 'mdi-progress-check'
              break
            case 'inactive':
              text = 'Gesperrt'
              icon = 'mdi-cancel'
              break
            default:
              text = status
              icon = 'mdi-question'
          }
          return { text, status, icon }
        })
      },
      userId() {
        return this.$route.params.userId
      },
      userInStore() {
        return this.getUserById(this.userId)
      },
      isLocalUser() {
        const user = this.getUserById(this.userId)
        return user && user.authProvider && user.authProvider.type === 'local'
      },
      rules() {
        const mailRules = {
          required: true,
          email: true,
          mailDomainMustExist: true,
        }

        if (this.userInStore && this.userInStore.authProvider && this.userInStore.authProvider._id) {
          mailRules.mailMustNotExistInUserAccount = {
            authProviderId: this.userInStore.authProvider._id,
            ownAccountId: this.userInStore._id,
          }
        }

        return {
          mail: mailRules,
        }
      },
    },

    created() {
      this.setData(this.userInStore)
    },

    data: () => ({
      accountName: null,
      authProviderName: null,
      firstName: null,
      lastName: null,
      mail: null,
      status: null,
      roles: [],
    }),

    methods: {
      ...mapActions({
        updateUser: 'users/updateAction',
      }),
      setData(user) {
        if (user) {
          this.accountName = user.accountName
          this.authProviderName = user.authProvider.nameAndType
          this.firstName = user.firstName
          this.lastName = user.lastName
          this.mail = user.mail
          this.status = user.status
          this.roles = user.roles
        }
      },
      submit() {
        const payload = {
          ...this.userInStore,
          firstName: this.firstName,
          lastName: this.lastName,
          roles: this.roles,
          status: this.status,
          mail: this.mail,
        }
        this.updateUser(payload)
        this.$router.push({ name: 'manage-users' })
      }
    },

    watch: {
      userInStore(data) {
        this.setData(data)
      },
    },
  }
</script>
