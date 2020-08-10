<template>
  <validation-observer v-slot="{ invalid }">
    <v-card>
      <v-toolbar color="indigo" dark>
        <v-icon left>mdi-desktop-classic</v-icon>
        <v-toolbar-title>Buchbare Einheit anpassen</v-toolbar-title>
      </v-toolbar>

      <v-card-text style="height: calc(100vh - 272px); overflow-y: auto;">
        <ValidationProvider name="Bezeichnung" rules="required|min:5" v-slot="{ errors, validate }">
          <v-text-field
            :error-messages="errors"
            @keyup="validate"
            class="mt-8"
            clearable
            color="primary"
            filled
            label="Bezeichnung"
            v-model="name"
          />
        </ValidationProvider>
      </v-card-text>

      <v-divider/>

      <v-card-actions class="grey lighten-3">
        <btn-cancel @cancel="close"/>
        <v-spacer/>
        <btn-submit :disabled="invalid || disabled" @submit="submit"/>
      </v-card-actions>
    </v-card>
  </validation-observer>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    created() {
      this.init()
    },

    data: () => ({
      name: null,
    }),

    methods: {
      ...mapActions({
        updateShareableUnit: 'shareableUnits/updateAction',
      }),
      init() {
        this.name = this.item.name
      },
      close() {
        this.$emit('close')
      },
      submit() {
        this.updateShareableUnit({
          _id: this.item.id,
          name: this.name,
          roomId: this.item.roomId,
        })
        this.close()
      },
    },

    props: {
      item: {
        type: Object,
        required: true,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },

    watch: {
      item() {
        this.init()
      },
    }
  }
</script>
