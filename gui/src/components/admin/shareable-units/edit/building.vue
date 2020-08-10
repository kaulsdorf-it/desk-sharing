<template>
  <validation-observer v-slot="{ invalid }">
    <v-card>
      <v-toolbar color="indigo" dark>
        <v-icon left>mdi-bank</v-icon>
        <v-toolbar-title>Gebäude anpassen</v-toolbar-title>
      </v-toolbar>

      <v-card-text style="height: calc(100vh - 272px); overflow-y: auto;">
        <ValidationProvider name="Bezeichnung" rules="required|min:4" v-slot="{ errors, validate }">
          <v-text-field
            :disabled="disabled"
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
        updateBuilding: 'buildings/updateAction',
      }),
      init() {
        this.name = this.item.name
      },
      close() {
        this.$emit('close')
      },
      submit() {
        this.updateBuilding({
          _id: this.item.id,
          name: this.name,
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
      }
    }
  }
</script>
