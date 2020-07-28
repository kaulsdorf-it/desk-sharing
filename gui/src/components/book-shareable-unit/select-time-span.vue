<template>
  <v-row>
    <v-col cols="6">
      <ValidationProvider :rules="rules" v-slot="{ errors }">
        <v-text-field
          :disabled="disabled"
          clearable
          filled
          label="von"
          type="time"
          v-model="fromValue"
        />
      </ValidationProvider>
    </v-col>
    <v-col cols="6">
      <ValidationProvider :rules="rules" v-slot="{ errors }">
        <v-text-field
          :disabled="disabled"
          clearable
          filled
          label="bis"
          type="time"
          v-model="tillValue"
        />
      </ValidationProvider>
    </v-col>
  </v-row>
</template>

<script>

  export default {
    computed: {
      fromValue: {
        get() {
          return this.from
        },
        set(value) {
          this.$emit('setFrom', value)
        }
      },
      tillValue: {
        get() {
          return this.till
        },
        set(value) {
          this.$emit('setTill', value)
        }
      },
    },

    data: () => ({
      rules: {
        required: true,
      },
    }),

    props: {
      from: {
        type: String,
        required: false,
      },
      till: {
        type: String,
        required: false,
      },
      disabled: {
        type: Boolean,
        default: false,
      }
    }
  }
</script>
