<template>
  <v-navigation-drawer
    :value="true"
    absolute
    app
    bottom
    class="px-4"
    right
    width="400"
  >
    <v-chip class="my-4" label>Meine Buchungen</v-chip>
    <v-divider/>

    <v-row :key="date" v-for="date of Object.keys(myBookings).sort()">
      <v-col class="pb-0" cols="3">{{$moment(date).format('DD.MM.Y')}}</v-col>
      <v-col class="pb-0" cols="9">{{ myBookings[date][0].timeFrom }}-{{ myBookings[date][0].timeTill }} Uhr</v-col>

      <v-col class="pt-0 pb-4" cols="12">
        <shareable-unit :shareable-unit-id="myBookings[date][0].shareableUnitId"/>
      </v-col>

      <v-col cols="12">
        <v-divider/>
      </v-col>
    </v-row>
  </v-navigation-drawer>
</template>

<script>
  import { mapGetters } from 'vuex'
  import ShareableUnit from './shareable-unit'

  export default {
    components: {
      ShareableUnit,
    },

    computed: {
      ...mapGetters({
        myBookings: 'shareableUnitBookings/getMyBookings',
      }),
    }
  }
</script>
