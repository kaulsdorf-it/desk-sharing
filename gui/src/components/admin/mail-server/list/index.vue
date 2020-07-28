<template>
  <v-card style="height: calc(100vh - 150px)">
    <v-btn
      @click="navigateToRoute('manage-mail-server', { mailServerId: 'new' })"
      absolute
      color="primary"
      fab
      right
      small
      text
      top
    >
      <v-icon size="30">mdi-plus-circle</v-icon>
    </v-btn>

    <v-card-title>
      E-Mail-Servers
    </v-card-title>

    <v-divider/>

    <v-card-text>
      <v-list style="">
        <v-list-item-group color="primary" v-model="selected">
          <v-list-item
            :key="item._id"
            @click="select(item._id)"
            v-for="item of items"
          >
            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.host }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters({
        items: 'systemConfig/mailServers/getAll',
      }),
    },

    data: () => ({
      selected: null,
    }),

    methods: {
      select(id) {
        this.selected = id
        this.navigateToRoute('manage-mail-server', { mailServerId: id })
      },
    }
  }
</script>
