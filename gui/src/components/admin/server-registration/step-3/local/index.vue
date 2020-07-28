<template>
  <v-card dense elevation="5" style="border-left: 1px solid #ddd">
    <v-toolbar color="blue-grey" dark dense>
      <v-toolbar-title>[{{ authProvider.type.toUpperCase() }}] {{ authProvider.provider.name }}</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-row>
        <v-col cols="6">
          <v-text-field
            :value="authProvider.provider.passwordExpiresInDays"
            dense
            disabled
            hide-details
            label="Ablaufzeit des Kennworts in Tagen"
            readonly
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            :value="authProvider.provider.anonymizeAccountOnInactivityAfterDays"
            dense
            disabled
            hide-details
            label="Konto anonymisieren nach x Tagen"
            readonly
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    props: {
      authProvider: {
        type: Object,
        required: true,
      }
    }
  }
</script>
