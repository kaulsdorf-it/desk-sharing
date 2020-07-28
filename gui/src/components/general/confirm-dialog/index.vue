<template>
  <v-dialog
    :disabled="disabled"
    :max-width="maxWidth"
    persistent
    v-model="showDialog"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        :class="classes"
        :color="btnColor"
        :disabled="disabled"
        :large="large"
        :medium="medium"
        :outlined="outlined"
        :small="small"
        :style="btnStyle"
        :text="text"
        @click.stop="() => {}"
        v-if="label"
        v-on="on"
      >
        <v-icon left v-if="icon">{{ icon }}</v-icon>
        <span>{{ label }}&nbsp;&nbsp;</span>
      </v-btn>

      <v-btn
        :class="classes"
        :color="btnColor"
        :disabled="disabled"
        :fab="fab"
        :icon="!fab"
        :large="large"
        :medium="medium"
        :outlined="outlined"
        :small="small"
        :style="btnStyle"
        :text="text"
        @click.stop="() => {}"
        v-else
        v-on="on"
      >
        <v-icon>{{ icon }}</v-icon>
      </v-btn>
    </template>

    <div id="delete-dialog">
      <v-card>
        <v-toolbar color="indigo" dark dense>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer/>
          <v-btn @click="disagree" icon small>
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="subheading" v-html="description" v-if="description"/>
        <v-card-actions class="grey lighten-3">
          <v-spacer/>
          <v-btn
            @click="disagree"
            color="error"
            large
            text
          >
            Nein
          </v-btn>
          <v-btn
            @click="agree"
            color="primary"
            large
          >
            Ja
          </v-btn>
        </v-card-actions>

      </v-card>
    </div>

  </v-dialog>
</template>

<script>
  export default {
    data() {
      return {
        showDialog: false
      }
    },

    props: {
      label: {
        type: String,
        required: false
      },
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: false
      },
      small: {
        type: Boolean,
        required: false
      },
      medium: {
        type: Boolean,
        required: false
      },
      large: {
        type: Boolean,
        required: false
      },
      icon: {
        type: String,
        default: 'clear'
      },
      fab: {
        type: Boolean,
        default: false,
      },
      disabled: {
        type: Boolean,
        required: false
      },
      text: {
        type: Boolean,
        required: false,
      },
      outlined: {
        type: Boolean,
        required: false,
      },
      fullWidth: {
        type: Boolean,
        required: false,
      },
      btnColor: {
        type: String,
        default: 'red'
      },
      classes: {
        type: String,
        required: false,
      },
      btnStyle: {
        type: String,
        required: false,
      },
      maxWidth: {
        type: String | Number,
        default: 600,
      }
    },

    methods: {
      agree() {
        this.$emit('agree')
        this.showDialog = false
      },
      disagree() {
        this.$emit('disagree')
        this.showDialog = false
      }
    }
  }
</script>

<style scoped>
  .btn-confirm-dialog {
    overflow: hidden;
  }
</style>
