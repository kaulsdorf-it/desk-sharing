<template>
  <div style="text-align: center">
    <v-date-picker
      :allowed-dates="isDateAllowed"
      :first-day-of-week="1"
      class="border_all"
      locale="de-de"
      no-title
      v-model="value"
    />
  </div>
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
      today() {
        return this.$moment().format('YYYY-MM-DD')
      },
      maxBookableDate() {
        return this.$moment().add(60, 'days').format('YYYY-MM-DD')
      }
    },

    data: () => ({
      menu: false,
    }),

    methods: {
      isDateAllowed(date) {
        return this.today <= date && this.maxBookableDate >= date
      }
    },

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
