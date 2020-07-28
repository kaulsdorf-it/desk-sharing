<template>
  <v-timeline align-top class="mt-6" dense>
    <v-timeline-item :color="getIconColor(urlTestResult)" right>
      <template v-slot:icon>
        <v-icon color="white" size="20">{{ getIcon(urlTestResult) }}</v-icon>
      </template>
      <v-card class="elevation-4 blue-grey lighten-4">
        <v-card-title class="body-1">URL prüfen</v-card-title>
        <v-card-text>
          <pre class="white detail">{{ urlTestResult }}</pre>
        </v-card-text>
      </v-card>
    </v-timeline-item>

    <v-timeline-item :color="getIconColor(technicalUserCheckResult)" right>
      <template v-slot:icon>
        <v-icon color="white" size="20">{{ getIcon(technicalUserCheckResult) }}</v-icon>
      </template>
      <v-card class="elevation-4 blue-grey lighten-4">
        <v-card-title class="body-1">Technischen LDAP User prüfen</v-card-title>
        <v-card-text>
          <pre class="white detail">{{ technicalUserCheckResultWithoutPassword }}</pre>
        </v-card-text>
      </v-card>
    </v-timeline-item>
  </v-timeline>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters({
        getLdapServerUrlCheckResultByUrl: 'serverConfig/getLdapServerUrlCheckResultByUrl',
        getTechnicalUserCheckResultByConfig: 'serverConfig/getTechnicalUserCheckResultByConfig',
      }),
      technicalUserCheckResultWithoutPassword() {
        return this.technicalUserCheckResult
          ? { ...this.technicalUserCheckResult, password: undefined }
          : this.technicalUserCheckResult
      },
      urlTestResult() {
        if (this.config && this.config.url) {
          return this.getLdapServerUrlCheckResultByUrl(this.config.url) || null
        }
        return null
      },
      technicalUserCheckResult() {
        return this.getTechnicalUserCheckResultByConfig(this.config)
      },
    },

    data: () => ({
      step: 0
    }),

    methods: {
      getIcon(data) {
        if (!data) {
          return 'mdi-test-tube'
        }

        if (data.error) {
          return 'mdi-close'
        }

        if (data.result) {
          return 'mdi-check'
        }

        return 'mdi-test-tube'
      },
      getIconColor(data) {
        if (!data) {
          return 'warning'
        }

        if (data.error) {
          return 'error'
        }

        if (data.result) {
          return 'success'
        }

        return 'warning'
      }
    },

    props: {
      config: {
        type: Object,
        default: null,
      },
    }
  }
</script>

<style scoped>
  .detail {
    border: 1px solid grey;
    border-radius: 4px;
    font-size: 12px;
    max-height: 190px;
    overflow-y: auto;
  }
</style>
