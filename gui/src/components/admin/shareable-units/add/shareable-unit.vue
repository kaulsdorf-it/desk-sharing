<template>
  <kit-dialog
    :title="`Buchbare Einheit in Raum ${parent.name} hinzufügen`"
    dialogIcon="mdi-desktop-classic"
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
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    data: () => ({
      name: null,
    }),

    methods: {
      ...mapActions({
        addShareableUnit: 'shareableUnits/addAction',
      }),
      submit(close) {
        this.addShareableUnit({
          name: this.name,
          roomId: this.parent.id,
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
