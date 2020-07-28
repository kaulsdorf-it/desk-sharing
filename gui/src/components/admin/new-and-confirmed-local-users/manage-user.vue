<template>
  <ValidationObserver v-slot="{ invalid }">
    <v-card class="elevation-1">
      <v-card-title>Neue, lokale Benutzer freischalten</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="4">
            <v-text-field
              disabled
              filled
              hide-details
              label="Anmeldename"
              readonly
              v-model="userObject.accountName"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="3">
            <ValidationProvider :rules="rules.name" name="Der Vorname" v-slot="{ errors, validate }">
              <v-text-field
                :error-messages="errors"
                @keyup="validate"
                filled
                label="Vorname"
                v-model="userObject.firstName"
              />
            </ValidationProvider>
          </v-col>

          <v-col cols="3">
            <ValidationProvider :rules="rules.name" name="Der Nachname" v-slot="{ errors, validate }">
              <v-text-field
                :error-messages="errors"
                @keyup="validate"
                filled
                label="Nachname"
                v-model="userObject.lastName"
              />
            </ValidationProvider>
          </v-col>

          <v-col cols="6">
            <ValidationProvider :rules="rules.mail" name="Die E-Mail-Adresse" v-slot="{ errors, validate }">
              <v-text-field
                filled
                label="E-Mail-Adresse"
                v-model="userObject.mail"
              />
            </ValidationProvider>
          </v-col>

          <v-col cols="12">
            <v-subheader class="pl-0 subtitle-1">Benutzer ist auch:</v-subheader>
            <v-checkbox
              :key="role.role"
              :label="role.text"
              :value="role.role"
              class="mt-0"
              hide-details
              v-for="role of userRolesObjects"
              v-model="userObject.roles"
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider/>

      <v-card-actions class="grey lighten-3">
        <btn-cancel @cancel="close"/>
        <v-spacer/>
        <btn-submit @submit="submit"/>
      </v-card-actions>
    </v-card>
  </ValidationObserver>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters({
        userRolesObjects: 'users/getUserRolesObjects',
      }),
    },

    created() {
      this.init(this.item)
    },

    data() {
      return {
        userObject: null,
        rules: {
          name: {
            required: true,
            min: 3,
          },
          mail: {
            required: true,
            mailMustNotExistInUserAccount: {
              authProviderId: this.authProviderId,
            },
          },
        }
      }
    },

    methods: {
      ...mapActions({
        activateLocalUser: 'users/activateLocalUserAction',
      }),
      init(user) {
        this.userObject = JSON.parse(JSON.stringify(user))
      },
      close() {
        this.$emit('close')
      },
      submit() {
        this.activateLocalUser({
          ...this.userObject,
          status: 'active'
        })
        this.close()
      },
    },

    props: {
      item: {
        type: Object,
        required: true,
      },
      authProviderId: {
        type: String,
        required: true,
      }
    },

    watch: {
      item(user) {
        this.init(user)
      }
    },
  }
</script>
