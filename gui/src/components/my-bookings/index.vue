<template>
  <v-navigation-drawer
    :value="true"
    absolute
    app
    bottom
    class="px-4"
    right
    width="700"
  >
    <v-chip class="my-4" label>Meine Buchungen</v-chip>
    <v-divider/>

    <v-sheet height="880">
      <v-calendar
        :weekdays="[ 1, 2, 3, 4, 5, 6, 0]"
        color="primary"
        ref="calendar"
        short-weekdays
        type="month"
        v-model="start"
      >
        <template v-slot:day="{ present, past, date }">
          <v-row class="fill-height">
            <template v-if="myBookings[date]">
              <v-sheet
                class="caption px-4"
                height="100%"
                tile
                width="100%"
              >
                <div>{{ myBookings[date][0].timeFrom }}-{{ myBookings[date][0].timeTill }}</div>
                <shareable-unit :shareable-unit-id="myBookings[date][0].shareableUnitId"/>
              </v-sheet>
            </template>
          </v-row>
        </template>
      </v-calendar>
    </v-sheet>
  </v-navigation-drawer>
</template>

<script>
  import { mapGetters } from 'vuex'
  import ShareableUnit from './shareable-unit'

  export default {
    components: {
      ShareableUnit,
    },

    computed: {
      ...mapGetters({
        myBookings: 'shareableUnitBookings/getMyBookings',
      }),
      bookings() {
        return Object.keys(this.myBookings)
          .map(date => ({
            date,
            booking: this.myBookings[date][0],
          }))
      },
    },

    data: () => ({
      start: '2020-08-03',
    }),
  }
</script>
