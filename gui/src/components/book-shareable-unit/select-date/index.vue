<template>
  <v-calendar
    :short-weekdays="false"
    :weekdays="[ 1, 2, 3, 4, 5, 6, 0]"
    color="indigo lighten-4"
    ref="calendar"
    show-month-on-first
    type="month"
    v-model="selectedDate"
  >
    <template v-slot:day="{ present, past, date }">
      <v-row class="fill-height" style="overflow-y: auto;">
        <template v-if="myBookings[date]">
          <v-sheet
            class="caption px-3 primary lighten-5 mt-1"
            tile
            width="100%"
          >
            <div class="px-1">{{ myBookings[date][0].timeFrom }}-{{ myBookings[date][0].timeTill }}</div>
            <shareable-unit :shareable-unit-id="myBookings[date][0].shareableUnitId"/>
          </v-sheet>
        </template>
      </v-row>
    </template>
  </v-calendar>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import ShareableUnit from './shareable-unit'

  export default {
    components: {
      ShareableUnit,
    },

    computed: {
      ...mapGetters({
        myBookings: 'shareableUnitBookings/getMyBookings',
        getSelectedDate: 'shareableUnitBookings/selections/getDate',
      }),
      bookings() {
        return Object.keys(this.myBookings)
          .map(date => ({
            date,
            booking: this.myBookings[date][0],
          }))
      },
      selectedDate: {
        get() {
          return this.getSelectedDate
        },
        set(value) {
          this.selectDate(value)
        }
      },
    },

    methods: {
      ...mapMutations({
        selectDate: 'shareableUnitBookings/selections/selectDateMutation',
      }),
    },
  }
</script>
