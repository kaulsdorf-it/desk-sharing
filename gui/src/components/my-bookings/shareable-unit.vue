<template>
  <v-row>
    <v-col cols="4" class="body-1">{{ room.name }}</v-col>
    <v-col cols="6" class="body-1">{{ shareableUnit.name }}</v-col>
    <v-col class="py-0 body-2" cols="12">{{ building.name }}</v-col>
  </v-row>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters({
        getShareableUnitById: 'shareableUnits/getById',
        getRoomById: 'rooms/getById',
        getBuildingById: 'buildings/getById',
      }),
      shareableUnit() {
        return this.getShareableUnitById(this.shareableUnitId) || {}
      },
      room() {
        return this.getRoomById(this.shareableUnit.roomId) || {}
      },
      building() {
        return this.getBuildingById(this.room.buildingId)
      }
    },

    props: {
      shareableUnitId: {
        type: String,
        required: true,
      }
    }
  }
</script>
