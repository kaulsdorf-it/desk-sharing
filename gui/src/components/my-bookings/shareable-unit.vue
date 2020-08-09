<template>
  <div class="blue-grey lighten-4 pa-1">
    <div>{{ building.name }}</div>
    <div>R. {{ room.name }}</div>
    <div>{{ shareableUnit.name }}</div>
  </div>
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
