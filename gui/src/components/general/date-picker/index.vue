<template>
  <div id="date-picker-wrapper">
    <v-menu
      :close-on-content-click="false"
      :nudge-bottom="1"
      :nudge-right="0"
      min-width="290px"
      offset-y
      ref="datePicker"
      transition="scale-transition"
      v-model="showDatePicker"
    >
      <template v-slot:activator="{ on }">
        <div id="date-picker-activator">
          <v-text-field
            clearable
            label="Tag auswählen"
            prepend-icon="event"
            readonly
            type="date"
            v-model="selectDay"
            v-on="on"
          ></v-text-field>
        </div>
      </template>

      <v-date-picker
        :allowed-dates="allowedDates"
        :first-day-of-week="1"
        locale="de-de"
        no-title
        v-model="selectDay"
      >
        <v-spacer></v-spacer>
        <v-btn @click="showDatePicker = false" color="primary" text>Abbrechen</v-btn>
      </v-date-picker>
    </v-menu>
  </div>
</template>

<script>
  const today = new Date()
  const todayAsString = today.toISOString().slice(0, 10).toString()

  export default {
    data () {
      return {
        selectDay: this.date,
        showDatePicker: false,
      }
    },

    props: {
      date: {
        type: String,
        default: todayAsString,
      },
      allowedDates: {
        type: Function,
        default: () => true
      }
    },

    watch: {
      date (value) {
        this.selectDay = value
      },
      selectDay (value) {
        this.$emit('selectDay', value)
        this.showDatePicker = false
      }
    }
  }
</script>

<style>
  #date-picker-wrapper {
    width: 80%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    align-content: stretch;
  }

  #date-picker-wrapper .v-menu {
    flex-grow: 2;
  }

  #date-picker-wrapper .v-btn {
    height: 48px !important;
    width: 48px !important;
  }

  #date-picker-wrapper .v-btn:before {
    opacity: 0 !important;
  }

  #date-picker-wrapper .v-btn .v-ripple__container {
    display: none !important;
  }

  #date-picker-wrapper .v-input__slot {
    width: unset !important;
  }

  #date-picker-activator {
    height: 48px;
    display: flex;
    align-items: center;
    padding: 0 12px;
    width: 100%;
    font-size: 16px;
    color: rgba(0, 0, 0, .54);
  }

  .clear-button {
    margin: 0 !important;
  }

  .date-picker-button {
    margin: 0 !important;
    background: yellow;
  }

  .v-picker,
  .v-picker__body {
    background: #eee !important;
    border-radius: 0 !important;
  }

  .v-date-picker-table table {
    background: #eee !important;
  }

  .v-menu__content {
    border-radius: 0 !important;
  }
</style>
