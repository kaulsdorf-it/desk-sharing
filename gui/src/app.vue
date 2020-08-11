<template>
  <v-app>
    <app-menu/>
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

  export default {
    components: {
      AppMenu,
      AppFooter,
      AppSnackbar,
    },

    name: 'App',
  }
</script>
