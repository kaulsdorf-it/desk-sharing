<template>
  <ValidationObserver v-slot="{ invalid }">
    <v-stepper-content :step="step" :test="setFormValidity(!invalid)" style="height: calc(100vh - 397px); overflow-y: auto;">
      <ValidationProvider name="Beschreibung (öffentlich)" rules="required">
        <v-radio-group hide-details v-model="usageType">
          <v-container>
            <table class="full-width" style="border-spacing: 10px 0; border: none">
              <tbody>
              <tr>
                <td/>
                <td
                  :class="{ 'is-active': usageType === type.value }"
                  :key="type.value + '_type'"
                  align="center"
                  height="60"
                  v-for="type of types"
                >
                  <center>
                    <v-radio :value="type.value" color="secondary" style="width: 20px!important;"/>
                  </center>
                </td>
              </tr>

              <tr>
                <td align="right">Verwendung des Server als:</td>
                <td
                  :class="{ 'is-active': usageType === type.value }"
                  :key="type.value + '_title'"
                  align="center"
                  height="60"
                  v-for="type of types"
                >
                  <div class="title">{{ type.title }}</div>
                </td>
              </tr>

              <tr>
                <td align="right">Abrechnung:</td>
                <td
                  :class="{ 'is-active': usageType === type.value }"
                  :key="type.value + '_cost'"
                  align="center"
                  height="60"
                  v-for="type of types"
                >
                  {{ type.cost }}
                </td>
              </tr>

              <tr>
                <td/>
                <td
                  :class="{ 'is-active': usageType === type.value }"
                  :key="type.value + '_costDescr'"
                  align="center"
                  height="150"
                  v-for="type of types"
                >
                  {{ type.costDescription }}
                </td>
              </tr>
              </tbody>
            </table>
          </v-container>
        </v-radio-group>
      </ValidationProvider>
    </v-stepper-content>
  </ValidationObserver>
</template>

<script>
  import { mixin } from '../mixin'
  import { stepMixin } from '../step-mixin'

  export default {
    computed: {
      usageType: {
        get() {
          return this.config ? this.config.usageType : null
        },
        set(value) {
          this.setConfigValue({ name: 'usageType', value })
        }
      }
    },

    data() {
      return {
        types: [
          {
            title: 'Testumgebung',
            value: 'test',
            cost: 'kostenfrei',
            costDescription: '',
          },
          {
            title: 'Abnahmeumgebung',
            value: 'acceptance',
            cost: 'kostenfrei',
            costDescription: '',
          },
          {
            title: 'Produktivsystem',
            value: 'production',
            cost: 'kostenpflichtig',
            costDescription: 'Die Abrechnung erfolgt je ausgefülltem Formular und wird monatlich in Rechnung gestellt.',
          },
        ],
      }
    },

    mixins: [mixin, stepMixin],
  }
</script>

<style scoped>
  td {
    border: none;
  }

  tr:first-child > td:not(:first-child) {
    border-top: 1px solid #eee;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }

  tr:first-child > td.is-active {
    border-top: 1px solid transparent;
  }

  tr:last-child > td:not(:first-child) {
    border-bottom: 1px solid #eee;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  tr:last-child > td.is-active {
    border-bottom: 1px solid transparent;
  }

  tr > td:first-child {
    padding-right: 20px;
  }

  tr > td:not(:first-child) {
    border-left: 1px solid #eee;
    border-right: 1px solid #eee;
    color: #aaa;
    width: 25%;
  }

  tr > td.is-active {
    background-color: rgba(29, 146, 235, 0.1);
    border-left: 1px solid transparent;
    border-right: 1px solid transparent;
    color: #444;
  }
</style>
