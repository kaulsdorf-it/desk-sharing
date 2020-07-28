<template>
  <v-container fill-height v-if="serverConfig.serverDescription">
    <v-card class="elevation-0 full-width" color="transparent">
      <v-card-text>
        <v-card>
          <v-card-title>
            {{ serverConfig.serverDescription.companyName }},
            <span class="subtitle-1 pl-2">
            {{ serverConfig.serverDescription.organizationalUnitName }}
          </span>
          </v-card-title>
          <v-card-text>
            <p>
              <v-chip label>
                Anwendungsname: {{ serverConfig.serverDescription.serviceName }}<br/>
              </v-chip>
            </p>

            <p>
              <v-chip label>
                Verwendung der Anwendung: {{ serverConfig.serverDescription.usageType }}
              </v-chip>
            </p>
          </v-card-text>
        </v-card>

        <v-row class="px-2">
          <v-col
            :key="authority._id"
            class="px-1"
            v-for="authority of serverConfig.serverDescription.authorities"
          >
            <v-card tile>
              <v-card-title class="subtitle-1">
                <v-icon class="pr-1">{{ getAuthorityType(authority.authorityType).icon }}</v-icon>
                {{ getAuthorityType(authority.authorityType).text }}
              </v-card-title>
              <v-card-text>
                <div>Beschreibung: {{ authority.description }}</div>
                <div>Kontaktdaten: {{ authority.contactData }}</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters({
        serverConfig: 'serverConfig/getConfig',
        authorityTypes: 'serverConfig/getAuthorityTypes',
      }),
    },

    methods: {
      getAuthorityType(authorityType) {
        return this.authorityTypes.find(i => i.value === authorityType)
      }
    }
  }
</script>
