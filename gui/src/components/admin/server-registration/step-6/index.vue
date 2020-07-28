<template>
  <ValidationObserver v-slot="{ invalid }">
    <v-stepper-content :step="step" :test="setFormValidity(!invalid)" style="height: calc(100vh - 397px); overflow-y: auto;">
      <v-row>
        <v-col cols="4" offset="2">
          <ValidationProvider :rules="rules.costCenter" name="Die Kostenstelle" v-slot="{ errors, validate }">
            <v-text-field
              :error-messages="errors"
              @keyup="validate"
              filled
              hint="5-stellige Nummer der Kostenstelle"
              label="Kostenstelle *"
              persistent-hint
              v-model="costCenter"
            />
          </ValidationProvider>
        </v-col>

        <v-col cols="4">
          <ValidationProvider :rules="rules.locationId" name="Die Bahnstelle" v-slot="{ errors, validate }">
            <v-text-field
              :error-messages="errors"
              @keyup="validate"
              filled
              hint="5-stellige Nummer der Bahnstelle"
              label="Bahnstelle *"
              persistent-hint
              v-model="locationId"
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
      costCenter: {
        get() {
          return this.config ? this.config.costCenter : null
        },
        set(value) {
          this.setConfigValue({ name: 'costCenter', value })
        }
      },
      locationId: {
        get() {
          return this.config ? this.config.locationId : null
        },
        set(value) {
          this.setConfigValue({ name: 'locationId', value })
        }
      },
    },

    data() {
      return {
        rules: {
          costCenter: {
            required: true,
            min: 5,
          },
          locationId: {
            required: true,
            min: 5,
          },
        },
      }
    },

    mixins: [mixin, stepMixin],
  }
</script>
