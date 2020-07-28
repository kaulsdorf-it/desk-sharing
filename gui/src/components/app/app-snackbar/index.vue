<template>
  <v-snackbar
    :absolute="appMessage.absolute"
    :bottom="appMessage.y === 'bottom'"
    :color="appMessage.color"
    :left="appMessage.x === 'left'"
    :multi-line="appMessage.multiLine"
    :right="appMessage.x === 'right'"
    :style="appMessage.style"
    :timeout="appMessage.timeout"
    :top="appMessage.y === 'top'"
    v-model="appMessage.show"
  >
    <div class="subtitle-1" v-html="appMessage.text"/>
    <v-btn @click.native="appMessage.show = false" dark icon text>
      <v-icon>cancel</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script>
  import { EventBus } from '../../../event-bus'

  export default {

    data() {
      return {
        appMessage: {
          multiLine: false,
          y: 'top',
          x: null,
          color: 'green',
          type: 'info'
        },
      }
    },

    mounted() {
      EventBus.$on('appMessage', msgObj => {
        const appMessage = {
          show: true,
          timeout: 5000,
          multiLine: false,
          y: 'top',
          x: null,
          color: 'error'
        }

        this.appMessage = { ...appMessage, ...msgObj }
      })
    },
  }
</script>
