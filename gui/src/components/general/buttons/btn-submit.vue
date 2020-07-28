<template>
  <v-btn :class="{ 'full-width': fullWidth }" :color="color" :disabled="disabled" @click="$emit('submit')">
    <v-icon left v-if="icon">{{ icon }}</v-icon>
    {{ label }}
  </v-btn>
</template>

<script>
  export default {
    props: {
      label: {
        type: String,
        default: 'Speichern',
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      color: {
        type: String,
        default: 'primary',
      },
      icon: {
        type: String,
        required: false,
      },
      fullWidth: {
        type: Boolean,
        default: false,
      }
    }
  }
</script>
