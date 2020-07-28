<template>
  <v-container fluid>
    <v-row>
      <v-col cols="3">
        <list/>
      </v-col>
      <v-col cols="9">
        <router-view/>
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
