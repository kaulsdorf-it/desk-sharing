<template>
  <v-dialog
    :fullscreen="fullscreen"
    @keydown.esc="close"
    v-bind="$attrs"
    v-model="show"
  >
    <template v-slot:activator="{ on }">
      <slot :open="open" name="activatorBtn">
        <v-btn v-on="on">Ja</v-btn>
      </slot>
    </template>

    <v-card>
      <v-toolbar :color="$attrs.headerBgColor || 'primary'" dark dense>
        <div style="width: calc(100% - 30px)">
          <v-toolbar-title>{{ title }}</v-toolbar-title>
        </div>
        <v-btn @click="show = false" class="float-right" icon large>
          <v-icon>cancel</v-icon>
        </v-btn>
      </v-toolbar>

      <v-divider/>

      <v-card-text :style="style" style="overflow-y: auto">
        <slot name="content"/>
      </v-card-text>

      <v-divider/>

      <v-card-actions class="grey lighten-3">
        <slot :close="close" name="actions">
          <v-spacer/>
          <btn-cancel :label="$attrs.btnCancelLabel || 'Abbrechen'" @cancel="close"/>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
  export default {
    computed: {
      style() {
        if (this.fullscreen) {
          return { height: 'calc(100vh - 103px)' }
        }

        if (this.maxHeight || this.fullscreen) {
          return { height: 'calc(100vh - 100px)' }
        }

        if (this.height) {
          return { height: this.height + 'px' }
        }
      }
    },

    data: () => ({
      show: false,
    }),

    inheritAttrs: false,

    methods: {
      open() {
        this.show = true
      },
      close() {
        this.show = false
      },
    },

    props: {
      title: {
        type: String,
        required: true,
      },
      fullscreen: {
        type: Boolean,
        default: false,
      },
      maxHeight: {
        type: Boolean,
        default: false,
      },
      height: {
        type: Number | String,
        required: false,
      }
    },

    watch: {
      show(value) {
        if (value) {
          this.$emit('onShow', value)
        }
      }
    },
  }
</script>
