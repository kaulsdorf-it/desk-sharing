<template>
  <ValidationProvider :rules="rules" v-slot="{ errors }">
    <v-select
      :error-messages="errors"
      :items="items"
      clearable
      filled
      item-text="name"
      item-value="_id"
      label="Gebäude"
      v-model="value"
    />
  </ValidationProvider>
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
    },
  }
</script>
