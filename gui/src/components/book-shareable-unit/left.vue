<template>
  <v-col class="mt-0" md="12" lg="6">
    <v-card tile>
      <v-card-text>
        <div style="height: calc(100vh - 180px); overflow-y: auto;">
          <select-date/>
        </div>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
  import SelectDate from './select-date'

  export default {
    components: {
      SelectDate,
    },
  }
</script>
