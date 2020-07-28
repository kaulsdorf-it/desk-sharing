<template>
  <v-select
    :disabled="!buildingId"
    :items="items"
    clearable
    filled
    item-text="name"
    item-value="_id"
    label="Raum"
    v-model="value"
  />
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters({
        getByBuildingId: 'rooms/getByBuildingId',
      }),
      items() {
        return this.buildingId
          ? this.getByBuildingId(this.buildingId)
          : []
      },
      value: {
        get() {
          return this.roomId
        },
        set(value) {
          this.$emit('set', value)
        }
      }
    },

    props: {
      buildingId: {
        type: String,
        required: false,
      },
      roomId: {
        type: String,
        required: false,
      },
    }
  }
</script>
