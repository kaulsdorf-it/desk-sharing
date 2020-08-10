<template>
  <v-container fluid>
    <v-row>
      <v-col cols="6" class="pr-2">
        <list/>
      </v-col>
      <v-col cols="6" class="pl-2">
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import List from './list'

  export default {
    components: {
      List,
    },
  }
</script>
