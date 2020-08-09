<template>
  <v-toolbar-items v-if="isSignedIn">
    <v-menu offset-y open-on-hover>
      <template v-slot:activator="{ on }">
        <v-btn color="secondary" text v-on="on">
          <v-badge :value="showTopLevelIndicator" color="pink" dot>
            <v-icon>mdi-shield-account</v-icon>
          </v-badge>
        </v-btn>
      </template>

      <v-list>
        <template v-for="(menuItem, idx) of menuItems">
          <v-list-item :key="idx" :to="menuItem.to">
            <v-badge :value="!!menuItem.showIndicator" color="pink" dot overlap>
              <v-icon :color="menuItem.color" left>{{ menuItem.icon }}</v-icon>
            </v-badge>
            <v-list-item-title>{{ menuItem.label }}</v-list-item-title>
          </v-list-item>
          <v-divider :key="idx + '-divider'" v-if="menuItem.dividerBefore"/>
        </template>
      </v-list>
    </v-menu>
  </v-toolbar-items>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getMenuItemsForAdmin } from './admin-menu-items'

  export default {
    computed: {
      ...mapGetters({
        usersNotYetCleared: 'users/getUsersNotYetCleared',
        getAuthProviders: 'serverConfig/getAuthProviders',
      }),
      menuItems() {
        const adminMenuItems = getMenuItemsForAdmin(this.usersNotYetCleared)

        const menuItems = []

        if (this.isAllowed('admin')) {
          menuItems.push(adminMenuItems.menuItemManageUsers)

          if (this.getAuthProviders.find(i => i.type === 'local')) {
            menuItems.push(adminMenuItems.menuItemNewAndConfirmedLocalUsers)
          }
        }

        return menuItems
      },
      showTopLevelIndicator() {
        return this.menuItems.find(i => i.showIndicator) || false
      }
    },
  }
</script>
