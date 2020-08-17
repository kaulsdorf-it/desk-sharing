<template>
  <v-col class="mt-0" lg="6" md="12">
    <v-card tile>
      <v-card-text>
        <select-params/>

        <select-shareable-unit/>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
  import SelectParams from './select-params'
  import SelectShareableUnit from './select-shareable-units'

  export default {
    components: {
      SelectShareableUnit,
      SelectParams,
    },
  }
</script>
