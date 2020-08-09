<template>
  <v-container fluid>
    <div>
      <span style="width: 330px; float: left;">
        <v-card>
          <v-card-text style="height: calc(100vh - 150px); overflow-y: auto;">
            <select-building
              :buildingId="selectedBuildingId"
              @set="selectBuilding"
            />
            <select-room
              :buildingId="selectedBuildingId"
              :roomId="selectedRoomId"
              @set="selectRoom"
            />
            <select-date
              :date="selectedDate"
              :roomId="selectedRoomId"
              @set="selectDate"
            />
            <select-time-span
              :disabled="!selectedDate || !selectedRoomId"
              :from="selectedTimeSpanFrom"
              :till="selectedTimeSpanTill"
              @setFrom="selectFrom"
              @setTill="selectTill"
            />
          </v-card-text>
        </v-card>
      </span>

      <span style="position: relative; float: left; width: calc(100% - 355px); margin-left: 20px">
        <v-card class="px-4" style="height: calc(100vh - 150px); overflow-y: auto; position: relative">
          <show-shareable-units
            :date="selectedDate"
            :roomId="selectedRoomId"
            :timeFrom="selectedTimeSpanFrom"
            :timeTill="selectedTimeSpanTill"
            @book="bookSharableUnit"
            v-if="selectedDate && selectedRoomId && selectedTimeSpanFrom && selectedTimeSpanTill"
          />
        </v-card>
      </span>
    </div>
  </v-container>
</template>

<script>
  import { mapActions } from 'vuex'
  import ShowShareableUnits from './show-shareable-units'
  import SelectBuilding from './select-building'
  import SelectRoom from './select-room'
  import SelectDate from './select-date'
  import SelectTimeSpan from './select-time-span'

  export default {
    components: {
      ShowShareableUnits,
      SelectBuilding,
      SelectDate,
      SelectRoom,
      SelectTimeSpan,
    },

    data: () => ({
      selectedBuildingId: null,
      selectedRoomId: null,
      selectedDate: new Date().toISOString().substr(0, 10),
      selectedTimeSpanFrom: '08:00',
      selectedTimeSpanTill: '17:00',
    }),

    methods: {
      ...mapActions({
        getShareableUnitBookings: 'shareableUnitBookings/getShareableUnitBookingsAction',
        book: 'shareableUnitBookings/bookAction',
      }),
      selectBuilding(buildingId) {
        this.selectedRoomId = null
        this.selectedBuildingId = buildingId
      },
      selectRoom(roomId) {
        this.selectedRoomId = roomId
      },
      selectDate(date) {
        this.selectedDate = date
      },
      selectFrom(data) {
        this.selectedTimeSpanFrom = data
      },
      selectTill(data) {
        this.selectedTimeSpanTill = data
      },
      submit(reset) {
        this.getShareableUnitBookings(this.selectedRoomId)
        reset()
      },
      bookSharableUnit(shareableUnitId) {
        const payload = {
          shareableUnitId,
          date: this.selectedDate,
          timeFrom: this.selectedTimeSpanFrom,
          timeTill: this.selectedTimeSpanTill,
        }

        this.book(payload)
      }
    },

    watch: {
      selectedRoomId(roomId) {
        this.getShareableUnitBookings(roomId)
      }
    }
  }
</script>
