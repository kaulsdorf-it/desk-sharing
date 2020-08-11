<template>
  <v-col class="mt-0" cols="5">
    <v-card tile>
      <v-card-text>
        <div style="height: calc(100vh - 182px); overflow-y: auto;">
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
