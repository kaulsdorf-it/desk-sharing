<template>
  <ValidationObserver v-slot="{ invalid }">
    <v-row>
      <v-col cols="3">
        <v-chip :color="invalid ? 'error' : 'success'" class="full-width" label>
          <v-avatar>
            <v-icon left size="20">{{ authorityType.icon }}</v-icon>
          </v-avatar>
          {{ authorityType.text }}
        </v-chip>
      </v-col>
      <v-col cols="4">
        <ValidationProvider :rules="rules.description" name="Beschreibung (öffentlich)" v-slot="{ errors, validate }">
          <v-textarea
            :error-messages="errors"
            @keyup="validate"
            filled
            height="100"
            hint="Text ist anschließend öffentlich einsehbar"
            label="Beschreibung *"
            persistent-hint
            v-model="description"
          />
        </ValidationProvider>
      </v-col>
      <v-col cols="5">
        <ValidationProvider :rules="rules.contactData" name="Kontaktdaten" v-slot="{ errors, validate }">
          <v-textarea
            :error-messages="errors"
            @keyup="validate"
            filled
            height="100"
            hint="Name, Telefonnummer und E-Mail des / der Verwantwortlichen"
            label="Kontaktdaten *"
            persistent-hint
            v-model="contactData"
          />
        </ValidationProvider>
      </v-col>
    </v-row>
  </ValidationObserver>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { mixin } from '../mixin'

  export default {
    computed: {
      ...mapGetters({
        getAuthorityTypes: 'serverConfig/getAuthorityTypes',
      }),
      description: {
        get() {
          return this.config && this.config.authorities
            ? this.config.authorities.find(i => i.authorityType === this.authorityType.value).description
            : null
        },
        set(value) {
          const payload = {
            ...this.config.authorities.find(i => i.authorityType === this.authorityType.value),
            description: value,
          }

          this.setAuthority(payload)
        }
      },
      contactData: {
        get() {
          return this.config && this.config.authorities
            ? this.config.authorities.find(i => i.authorityType === this.authorityType.value).contactData
            : null
        },
        set(value) {
          const payload = {
            ...this.config.authorities.find(i => i.authorityType === this.authorityType.value),
            contactData: value,
          }

          this.setAuthority(payload)
        }
      },
    },

    data() {
      return {
        rules: {
          description: {
            required: true,
            min: 20
          },
          contactData: {
            required: true,
            min: 20
          }
        }
      }
    },

    mixins: [mixin],

    props: {
      authorityType: Object,
      required: true,
    }
  }
</script>
