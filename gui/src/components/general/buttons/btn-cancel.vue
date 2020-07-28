<template>
  <v-btn @click="$emit('cancel')" color="error" text>
    {{ label }}
  </v-btn>
</template>

<script>
  export default {
    props: {
      label: {
        type: String,
        default: 'Abbrechen'
      }
    }
  }
</script>
