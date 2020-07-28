<template>
  <v-menu
    :disabled="!roomId"
    close-on-content-click
    min-width="290px"
    offset-y
    ref="menu"
    transition="scale-transition"
    v-model="menu"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        :disabled="!roomId"
        :value="formattedDate"
        clearable
        label="Datum"
        prepend-icon="event"
        readonly
        v-bind="attrs"
        v-on="on"
      />
    </template>

    <v-date-picker
      :first-day-of-week="1"
      locale="de-de"
      no-title
      scrollable
      v-model="value"
    />
  </v-menu>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters({}),
      value: {
        get() {
          return this.date
        },
        set(value) {
          this.$emit('set', value)
        }
      },
      formattedDate() {
        return this.value
          ? this.$moment(this.value).format('DD.MM.Y')
          : ''
      }
    },

    data: () => ({
      menu: false,
    }),

    props: {
      roomId: {
        type: String,
        required: false,
      },
      date: {
        type: String,
        required: false,
      },
    }
  }
</script>
