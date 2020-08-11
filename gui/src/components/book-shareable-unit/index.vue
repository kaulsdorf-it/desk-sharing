<template>
  <v-container fluid>
    <v-row>
      <left/>
      <right/>
    </v-row>
  </v-container>
</template>

<script>
  import Left from './left'
  import Right from './right'

  export default {
    components: {
      Left,
      Right,
    },
  }
</script>
