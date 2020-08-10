<template>
  <validation-provider v-slot="{ invalid }">
    <kit-dialog
      dialogIcon="mdi-bank"
      headerBgColor="info"
      persistent
      scrollable
      title="Gebäude hinzufügen"
      width="600"
    >
      <template v-slot:activatorBtn="{ open }">
        <v-btn
          @click.stop="open"
          absolute
          color="primary"
          fab
          right
          small
          text
          top
        >
          <v-icon size="30">mdi-plus-circle</v-icon>
        </v-btn>
      </template>

      <template slot="content">
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
      </template>

      <template :close="close" v-slot:actions="{ close }">
        <btn-cancel @cancel="close"/>
        <v-spacer/>
        <btn-submit :disabled="invalid || disabled" @submit="submit(close)"/>
      </template>
    </kit-dialog>
  </validation-provider>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    data: () => ({
      name: null,
    }),

    methods: {
      ...mapActions({
        addBuilding: 'buildings/addAction',
      }),
      submit(close) {
        this.addBuilding({
          name: this.name
        })
        close()
      },
    },

    props: {
      parent: {
        type: Object,
        required: true,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    }
  }
</script>
