<template>
  <v-card dense elevation="5" style="border-left: 1px solid #ddd">
    <v-toolbar color="blue-grey" dark dense>
      <v-toolbar-title>[{{ authProvider.type.toUpperCase() }}] {{ authProvider.provider.name }}</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-text-field
            :value="authProvider.provider.url"
            dense
            disabled
            hide-details
            label="URL"
            readonly
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-text-field
            :value="authProvider.provider.baseDN"
            dense
            disabled
            hide-details
            label="baseDN"
            readonly
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            :value="authProvider.provider.userDN"
            dense
            disabled
            hide-details
            label="userDN"
            readonly
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-text-field
            :value="authProvider.provider.credentials.user"
            dense
            disabled
            hide-details
            label="Name des technischen Nutzers"
            readonly
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            :value="authProvider.provider.credentials.password"
            dense
            disabled
            hide-details
            label="Kennwort"
            readonly
            type="password"
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
