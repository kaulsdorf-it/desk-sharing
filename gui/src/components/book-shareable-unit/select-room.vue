<template>
  <ValidationProvider :rules="rules" v-slot="{ errors }">
    <v-select
      :disabled="!buildingId"
      :error-messages="errors"
      :items="items"
      clearable
      filled
      item-text="name"
      item-value="_id"
      label="Raum"
      v-model="value"
    />
  </ValidationProvider>
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

    data: () => ({
      rules: {
        required: true,
      },
    }),

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
