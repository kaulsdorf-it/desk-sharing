<template>
  <v-app-bar app class="app-menu" color="grey lighten-3" id="app-menu">
    <span id="branding">
      <span @click="navigateToRoute('/')" class="clickable" style="color: #f67f09">Desk Sharing</span>
    </span>

    <v-toolbar-title class="title" v-html="title"/>

    <v-spacer/>

    <v-toolbar-items>
      <template v-if="isSignedIn">
        <v-btn color="primary" exact text to="/book-shareable-unit">
          <v-icon large>mdi-calendar</v-icon>
        </v-btn>

        <application-admin v-if="isAdmin"/>
        <technical-admin v-if="isAdmin"/>

        <v-btn color="primary" exact text to="/about-this-app">
          <v-icon large>mdi-information-outline</v-icon>
        </v-btn>
      </template>
    </v-toolbar-items>
    <user-account/>
  </v-app-bar>
</template>

<script>
  import ApplicationAdmin from './application-admin'
  import TechnicalAdmin from './technical-admin'
  import UserAccount from './user-account'

  export default {
    components: {
      ApplicationAdmin,
      TechnicalAdmin,
      UserAccount,
    },

    computed: {
      title() {
        if (this.$route.meta.showFormName) {
          const form = this.getFormById(this.$route.params.formId)

          if (form) {
            const title = []
            if (this.$route.meta.prefix) {
              title.push('<span class="subtitle-2">' + this.$route.meta.prefix + ':</span>')
            }
            title.push(form.name)
            return title.join(' ')
          }
        } else {
          return this.$route.meta ? this.$route.meta.title : ''
        }
      },
    },

    data: () => ({
      dialog: false,
    }),
  }
</script>

<style scoped>
  #branding {
    font-family: sans-serif;
    font-weight: bold;
    font-size: 22px;
    padding-top: 0px;
    padding-right: 20px;
  }

  .toolbar-menu-title {
    display: flex;
    align-items: flex-end;
    height: 64px;
  }
</style>

<style>
  .app-menu .v-toolbar__title {
    position: relative;
    top: 2px;
    margin-left: 0 !important;
    left: 10px;
  }
</style>
