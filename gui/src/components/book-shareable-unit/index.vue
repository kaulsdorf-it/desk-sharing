<template>
  <ValidationObserver v-slot="{ invalid, valid, reset, pristine }">
    <v-container fluid>
      <v-row>
        <v-col cols="3">
          <v-card>
            <v-card-text style="height: calc(100vh - 200px); overflow-y: auto">
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
            <v-card-actions class="grey lighten-3">
              <btn-submit
                :disabled="invalid || pristine"
                @submit="submit(reset)"
                full-width
                label="Verfügbare Räume anzeigen"
              />
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col class="pt-4" cols="9">
          <span style="height: calc(100vh - 150px); overflow-y: auto; position: relative">
            <show-shareable-units
              :date="selectedDate"
              :roomId="selectedRoomId"
              @book="bookSharableUnit"
              v-if="valid"
              :timeFrom="selectedTimeSpanFrom"
              :timeTill="selectedTimeSpanTill"
            />
          </span>
        </v-col>
      </v-row>
    </v-container>
  </ValidationObserver>
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
        this.selectedDate = null
        this.selectedRoomId = null
        this.selectedBuildingId = buildingId
      },
      selectRoom(roomId) {
        this.selectedDate = null
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
  }
</script>
