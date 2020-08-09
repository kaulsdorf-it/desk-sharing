<template>
  <div>
    <v-alert :value="haveIBookedAlready" class="mt-4 mb-1" type="info">
      Sie haben für diesen Tag bereits einen Tisch gebucht. <b>Pro Tag</b> kann <b>nur ein Tisch</b> gebucht werden.
    </v-alert>

    <v-row>
      <v-col
        :key="unit._id"
        cols="12"
        lg="6"
        v-for="unit of shareableUnits"
      >
        <shareable-unit
          :bookings="getBookings(unit)"
          :date="date"
          :disableBooking="haveIBookedAlready"
          :room-id="roomId"
          :timeFrom="timeFrom"
          :timeTill="timeTill"
          :unit="unit"
          @book="data => $emit('book', data)"
        />
      </v-col>
    </v-row>
  </div>
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
        getByRoomId: 'shareableUnits/getByRoomId',
        getByRoomIdAndShareableUnitIdAndDate: 'shareableUnitBookings/getByRoomIdAndShareableUnitIdAndDate',
        getMyBookingsByDate: 'shareableUnitBookings/getMyBookingsByDate',
      }),
      shareableUnits() {
        return this.getByRoomId(this.roomId)
      },
      haveIBookedAlready() {
        return this.getMyBookingsByDate(this.date).length > 0
      }
    },

    methods: {
      getBookings(unit) {
        return this.getByRoomIdAndShareableUnitIdAndDate(this.roomId, unit._id, this.date)
      },
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
      timeFrom: {
        type: String,
        required: false,
      },
      timeTill: {
        type: String,
        required: false,
      },
    },
  }
</script>
