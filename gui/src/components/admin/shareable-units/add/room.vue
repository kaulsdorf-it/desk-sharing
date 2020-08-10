<template>
  <validation-provider v-slot="{ invalid }">
    <kit-dialog
      :title="`Raum in Gebäude ${parent.name} hinzufügen`"
      dialogIcon="mdi-view-quilt"
      headerBgColor="info"
      persistent
      scrollable
      width="600"
    >
      <template v-slot:activatorBtn="{ open }">
        <v-btn
          @click.stop="open"
          color="primary"
          icon
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>

      <template slot="content">
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
      </template>

      <template :close="close" v-slot:actions="{ close }">
        <btn-cancel @cancel="close"/>
        <v-spacer/>
        <btn-submit :disabled="invalid" @submit="submit(close)"/>
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
        addRoom: 'rooms/addAction',
      }),
      submit(close) {
        this.addRoom({
          name: this.name,
          buildingId: this.parent.id,
        })
        close()
      },
    },

    props: {
      parent: {
        type: Object,
        required: true,
      },
      invalid: {
        type: Boolean,
        default: false,
      },
    }
  }
</script>
