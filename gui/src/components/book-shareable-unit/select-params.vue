<template>
  <v-row>
    <v-col class="mt-1 mb-2 pt-0" md="2" sm="6">
      <v-text-field
        clearable
        filled
        hide-details
        label="von"
        type="time"
        v-model="fromValue"
      />
    </v-col>

    <v-col class="mt-1 mb-2 pt-0" md="2" sm="6">
      <v-text-field
        clearable
        filled
        hide-details
        label="bis"
        type="time"
        v-model="tillValue"
      />
    </v-col>

    <v-col class="mt-1 mb-2 pt-0" md="4" sm="6">
      <v-select
        :items="buildings"
        clearable
        filled
        hide-details
        item-text="name"
        item-value="_id"
        label="Gebäude"
        v-model="buildingId"
      />
    </v-col>

    <v-col class="mt-1 mb-2 pt-0" md="4" sm="6">
      <v-select
        :disabled="!getSelectedBuildingId"
        :items="rooms"
        clearable
        filled
        hide-details
        item-text="name"
        item-value="_id"
        label="Raum"
        v-model="roomId"
      />
    </v-col>
  </v-row>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'

  export default {
    computed: {
      ...mapGetters({
        getTimeFrom: 'shareableUnitBookings/selections/getTimeFrom',
        getTimeTill: 'shareableUnitBookings/selections/getTimeTill',
        buildings: 'buildings/getAll',
        getByBuildingId: 'rooms/getByBuildingId',
        getSelectedBuildingId: 'shareableUnitBookings/selections/getBuildingId',
        getSelectedRoomId: 'shareableUnitBookings/selections/getRoomId',
      }),
      fromValue: {
        get() {
          return this.getTimeFrom
        },
        set(value) {
          this.setTimeFrom(value)
        }
      },
      tillValue: {
        get() {
          return this.getTimeTill
        },
        set(value) {
          this.setTimeTill(value)
        }
      },
      buildingId: {
        get() {
          return this.getSelectedBuildingId
        },
        set(value) {
          this.selectBuildingId(value)
          this.selectRoomId()
        }
      },
      rooms() {
        return this.getSelectedBuildingId
          ? this.getByBuildingId(this.getSelectedBuildingId)
          : []
      },
      roomId: {
        get() {
          return this.getSelectedRoomId
        },
        set(value) {
          this.selectRoomId(value)
        }
      }
    },

    methods: {
      ...mapMutations({
        setTimeFrom: 'shareableUnitBookings/selections/selectTimeFromMutation',
        setTimeTill: 'shareableUnitBookings/selections/selectTimeTillMutation',
        selectBuildingId: 'shareableUnitBookings/selections/selectBuildingIdMutation',
        selectRoomId: 'shareableUnitBookings/selections/selectRoomIdMutation',
      }),
    },
  }
</script>
