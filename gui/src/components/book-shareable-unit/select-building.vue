<template>
  <v-select
    :items="items"
    clearable
    filled
    item-text="name"
    item-value="_id"
    label="Gebäude"
    v-model="value"
  />
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters({
        items: 'buildings/getAll',
      }),
      value: {
        get() {
          return this.buildingId
        },
        set(id) {
          this.$emit('set', id)
        }
      }
    },

    props: {
      buildingId: {
        type: String,
        required: false,
      },
    },
  }
</script>
