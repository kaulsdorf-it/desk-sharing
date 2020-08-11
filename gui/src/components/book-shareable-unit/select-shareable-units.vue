<template>
  <div style="height: calc(100vh - 260px); overflow-y: auto;">
    <v-alert :value="haveIBookedAlready" class="mr-6" type="info">
      Sie haben für diesen Tag bereits einen Tisch gebucht. <b>Pro Tag</b> kann <b>nur ein Tisch</b> gebucht werden.
    </v-alert>

    <v-row style="width: 100%">
      <v-col
        :key="unit._id"
        cols="12"
        lg="6"
        v-for="unit of shareableUnits"
      >
        <shareable-unit
          :bookings="getBookings(unit)"
          :date="selectedDate"
          :disableBooking="haveIBookedAlready"
          :room-id="selectedRoomId"
          :timeFrom="selectedTimeFrom"
          :timeTill="selectedTimeTill"
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
        selectedDate: 'shareableUnitBookings/selections/getDate',
        selectedBuildingId: 'shareableUnitBookings/selections/getBuildingId',
        selectedRoomId: 'shareableUnitBookings/selections/getRoomId',
        selectedTimeFrom: 'shareableUnitBookings/selections/getTimeFrom',
        selectedTimeTill: 'shareableUnitBookings/selections/getTimeTill',
      }),
      shareableUnits() {
        return this.getByRoomId(this.selectedRoomId)
      },
      haveIBookedAlready() {
        return this.getMyBookingsByDate(this.selectedDate).length > 0
      }
    },

    methods: {
      getBookings(unit) {
        return this.getByRoomIdAndShareableUnitIdAndDate(this.selectedRoomId, unit._id, this.selectedDate)
      },
    },
  }
</script>
