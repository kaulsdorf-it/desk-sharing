<template>
  <v-card>
    <v-toolbar :color="headerColor" dark dense>
      <v-toolbar-title>{{ unit.name }}</v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <v-row
        :key="booking._id"
        v-for="booking of bookings"
        v-if="bookings.length > 0"
      >
        <v-col cols="4">{{ booking.timeFrom }}-{{ booking.timeTill }} Uhr</v-col>
        <v-col cols="8">
          <div v-if="myself._id === booking.userId">Reserviert für mich</div>
          <div v-else>Reserviert<br/>#{{ booking.userId }}</div>
        </v-col>
      </v-row>

      <v-subheader v-if="bookings.length === 0">
        <i>noch frei buchbar</i>
      </v-subheader>
    </v-card-text>

    <v-divider/>

    <v-card-actions class="grey lighten-3">
      <v-spacer/>
      <btn-submit :disabled="disableBooking || canNotBeBooked" @submit="submit" label="Buchen"/>
    </v-card-actions>
  </v-card>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters({
        myself: 'login/user',
      }),
      canNotBeBooked() {
        for (const b of this.bookings) {
          const cond1 = this.timeFrom >= b.timeFrom && this.timeFrom <= b.timeTill
          const cond2 = this.timeTill >= b.timeFrom && this.timeTill <= b.timeTill

          if (cond1 || cond2) {
            return true
          }
        }

        return false
      },
      headerColor() {
        return this.canNotBeBooked
          ? 'grey'
          : 'indigo'
      }
    },

    methods: {
      submit() {
        this.$emit('book', this.unit._id)
      },
    },

    props: {
      unit: {
        type: Object,
        required: true,
      },
      bookings: {
        type: Array,
        default: () => ([]),
      },
      timeFrom: {
        type: String,
        required: false,
      },
      timeTill: {
        type: String,
        required: false,
      },
      disableBooking: {
        type: Boolean,
        default: false,
      }
    }
  }
</script>

<style>
  div > .box:first-child {
    border-left: 1px solid #ddd;
  }

  div > .box {
    border-right: 1px solid #ddd;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    text-align: center;
  }

</style>
