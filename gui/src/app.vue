<template>
  <v-app>
    <app-menu/>
    <my-bookings v-if="showMyBooking"/>
    <v-main class="grey lighten-4">
      <router-view/>
    </v-main>
    <app-footer/>
    <app-snackbar/>
  </v-app>
</template>

<script>
  import AppMenu from './components/app/app-menu'
  import AppFooter from './components/app/app-footer'
  import AppSnackbar from './components/app/app-snackbar'
  import MyBookings from './components/my-bookings/index'

  export default {
    computed: {
      showMyBooking() {
        const routeName = this.$route.name
        return this.isSignedIn && routeName === 'book-shareable-unit'
      }
    },

    components: {
      AppMenu,
      AppFooter,
      AppSnackbar,
      MyBookings,
    },

    name: 'App',
  }
</script>
