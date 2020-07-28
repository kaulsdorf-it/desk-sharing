<template>
  <v-container>
    <v-card class="mb-4">
      <v-card-title>FORMS-Server registrieren</v-card-title>
      <v-card-text>
        <p>
          Registrieren Sie diesen Server an der zentralen FORMS-Registry Ihres Unternehmens!
        </p>
      </v-card-text>
    </v-card>
    <v-stepper :value="currentStep">
      <v-stepper-header class="elevation-0" x-placement="left">
        <v-stepper-step :color="getStepColor(1)" :complete="completed.step_1" step="1">Verwendung</v-stepper-step>

        <v-divider/>

        <v-stepper-step :color="getStepColor(2)" :complete="completed.step_2" step="2">Bezeichnung und Registry</v-stepper-step>

        <v-divider/>

        <v-stepper-step :color="getStepColor(3)" :complete="completed.step_3" step="3">Authentifizierung</v-stepper-step>

        <v-divider/>

        <v-stepper-step :color="getStepColor(4)" :complete="completed.step_4" step="4">Nutzung durch</v-stepper-step>

        <v-divider/>

        <v-stepper-step :color="getStepColor(5)" :complete="completed.step_5" step="5">Kontaktdaten</v-stepper-step>

        <v-divider/>

        <v-stepper-step :color="getStepColor(6)" :complete="completed.step_5" step="6" v-if="usageType === 'production'">
          Abrechnungsdaten
        </v-stepper-step>
      </v-stepper-header>

      <v-divider/>

      <ValidationObserver ref="observer" tag="form" v-slot="{ invalid }">
        <step1 :step="1" @stepIsValid="isValid => { completed.step_1 = isValid }"/>
        <step2 :step="2" @stepIsValid="isValid => { completed.step_2 = isValid }"/>
        <step3 :step="3" @stepIsValid="isValid => { completed.step_3 = isValid }"/>
        <step4 :step="4" @stepIsValid="isValid => { completed.step_4 = isValid }"/>
        <step5 :step="5" @stepIsValid="isValid => { completed.step_5 = isValid }"/>
        <step6 :step="6" @stepIsValid="isValid => { completed.step_6 = isValid }" v-if="lastStep > 5"/>

        <v-divider/>

        <v-card-actions class="grey lighten-3">
          <v-spacer/>
          <v-btn :disabled="currentStep <= 1" @click="currentStep--" color="primary" fab small>
            <v-icon size="28">mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn :disabled="currentStep >= lastStep" @click="currentStep++" color="primary" fab small>
            <v-icon size="28">mdi-chevron-right</v-icon>
          </v-btn>
          <v-spacer/>
          <btn-submit
            :disabled="invalid"
            @submit="registerServer"
            color="success"
            label="Registrierung absenden"
          />
        </v-card-actions>
      </ValidationObserver>
    </v-stepper>
  </v-container>
</template>

<script>
  import { mapActions } from 'vuex'
  import { mixin } from './mixin'

  import Step1 from './step-1'
  import Step2 from './step-2'
  import Step3 from './step-3'
  import Step4 from './step-4'
  import Step5 from './step-5'
  import Step6 from './step-6'

  export default {
    components: {
      Step1,
      Step2,
      Step3,
      Step4,
      Step5,
      Step6,
    },

    computed: {
      usageType() {
        return this.config ? this.config.usageType : null
      },
      lastStep() {
        return this.usageType === 'production' ? 6 : 5
      },
    },

    data: () => ({
      currentStep: 1,
      completed: {
        step_1: false,
        step_2: false,
        step_3: false,
        step_4: false,
        step_5: false,
        step_6: false,
      }
    }),

    methods: {
      ...mapActions({
        registerServer: 'serverConfig/registerServerAction',
      }),
      getStepColor(currentStep) {
        return this.currentStep === currentStep
          ? this.completed['step_' + currentStep]
            ? 'success'
            : 'primary'
          : 'grey'
      }
    },

    mixins: [mixin],
  }
</script>
