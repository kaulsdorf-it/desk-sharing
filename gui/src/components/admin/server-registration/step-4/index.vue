<template>
  <ValidationObserver v-slot="{ invalid }">
    <v-stepper-content :step="step" :test="setFormValidity(!invalid)" style="height: calc(100vh - 397px); overflow-y: auto;">
      <v-row>
        <v-col cols="4" offset="2">
          <ValidationProvider :rules="rules.companyName" name="Der Name des Unternehmens" v-slot="{ errors, validate }">
            <v-text-field
              :error-messages="errors"
              @keyup="validate"
              filled
              hint="Name des Unternehmens / des Konzernteils"
              label="Firmenname *"
              persistent-hint
              v-model="companyName"
            />
          </ValidationProvider>
        </v-col>

        <v-col cols="4">
          <ValidationProvider :rules="rules.organizationalUnitName" name="Der Abteilungsname" v-slot="{ errors, validate }">
            <v-text-field
              :error-messages="errors"
              @keyup="validate"
              filled
              hint="Name der Organisationseinheit (OE) / Abteilung"
              label="Abteilungsname *"
              persistent-hint
              v-model="organizationalUnitName"
            />
          </ValidationProvider>
        </v-col>
      </v-row>
    </v-stepper-content>
  </ValidationObserver>
</template>

<script>
  import { mixin } from '../mixin'
  import { stepMixin } from '../step-mixin'

  export default {
    computed: {
      companyName: {
        get() {
          return this.config ? this.config.companyName : null
        },
        set(value) {
          this.setConfigValue({ name: 'companyName', value })
        }
      },
      organizationalUnitName: {
        get() {
          return this.config ? this.config.organizationalUnitName : null
        },
        set(value) {
          this.setConfigValue({ name: 'organizationalUnitName', value })
        }
      },
    },

    data() {
      return {
        rules: {
          companyName: {
            required: true,
            min: 5,
          },
          organizationalUnitName: {
            required: true,
            min: 5,
          },
        },
      }
    },

    mixins: [mixin, stepMixin],
  }
</script>
