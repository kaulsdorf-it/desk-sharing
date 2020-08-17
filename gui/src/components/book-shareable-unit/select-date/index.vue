<template>
  <div>
    <v-toolbar color="white" flat>
      <v-btn @click="setToday" class="mr-4" color="secondary" outlined>Heute</v-btn>
      <v-spacer/>
      <v-btn @click="previousWeek" color="grey darken-2" fab small text>
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-btn @click="nextWeek" class="ml-2" color="grey darken-2" fab small text>
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
      <v-spacer/>
      <v-toolbar-title>{{ $moment(selectedDate).format('DD.MM.Y') }}</v-toolbar-title>
    </v-toolbar>

    <v-calendar
      :events="events"
      :now="selectedDate"
      :short-weekdays="false"
      :weekdays="[ 1, 2, 3, 4, 5, 6, 0]"
      color="primary"
      interval-height="40"
      locale="de-de"
      ref="calendar"
      show-month-on-first
      style="height: calc(100vh - 250px)"
      type="week"
      v-model="selectedDate"
    >
      <template v-slot:event="{ eventParsed }">
        <shareable-unit :shareable-unit-id="eventParsed.input.name"/>
      </template>
    </v-calendar>
  </div>
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
      events() {
        return Object.values(this.myBookings).flat(1).map(i => ({
          name: i.shareableUnitId,
          start: `${i.date} ${i.timeFrom}`,
          end: `${i.date} ${i.timeTill}`,
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
      setToday() {
        this.selectDate(this.$moment().format('YYYY-MM-DD'))
      },
      nextWeek() {
        this.selectDate(this.$moment(this.selectedDate).add(1, 'weeks').format('YYYY-MM-DD'))
        //this.$refs.calendar.next()
      },
      previousWeek() {
        this.selectDate(this.$moment(this.selectedDate).add(-1, 'weeks').format('YYYY-MM-DD'))
        //this.$refs.calendar.prev()
      },
    },
  }
</script>
