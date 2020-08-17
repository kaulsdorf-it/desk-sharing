<template>
  <div @click="test" class="pa-1">
    <div>{{ building.name }}</div>
    <div>R. {{ room.name }}</div>
    <div>{{ shareableUnit.name }}</div>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'

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

    methods: {
      ...mapMutations({
        setBuildingId: 'shareableUnitBookings/selections/selectBuildingIdMutation',
        setRoomId: 'shareableUnitBookings/selections/selectRoomIdMutation',
      }),
      test() {
        console.log('select', this.room.buildingId, this.shareableUnit.roomId)
        this.setBuildingId(this.room.buildingId)
        this.setRoomId(this.shareableUnit.roomId)
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
