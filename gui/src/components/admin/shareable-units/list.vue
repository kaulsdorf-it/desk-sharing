<template>
  <v-card>
    <add :parent="{}"/>

    <v-card-title>
      Inventar
    </v-card-title>

    <v-divider/>

    <v-card-text style="height: calc(100vh - 220px); overflow-y: auto;">
      <v-treeview
        :items="treeNodes"
        :open.sync="open"
      >
        <template v-slot:prepend="{ item }">
          <v-icon>
            {{ getIcon(item.type) }}
          </v-icon>
        </template>

        <template v-slot:label="{ item }">
          <span @click="$emit('select', item)" class="pr-3 clickable">{{ item.name }}</span>
          <add :parent="item" v-if="item.type !== 'shareableUnit'"/>
          <confirm-dialog
            :description="getRemoveItemDialogDescription(item)"
            :dialogIcon="getIcon(item.type)"
            :title="getRemoveItemDialogTitle(item)"
            @agree="removeShareableUnit(item.id)"
          />
        </template>
      </v-treeview>
    </v-card-text>
  </v-card>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import Add from './add'

  export default {
    components: {
      Add,
    },

    computed: {
      ...mapGetters({
        buildings: 'buildings/getAll',
        getRoomsByBuildingId: 'rooms/getByBuildingId',
        getInventoryByRoomId: 'shareableUnits/getByRoomId',
      }),
      treeNodes() {
        return this.buildings.map(b => {
          const rooms = this.getRoomsByBuildingId(b._id) || []
          return {
            id: b._id,
            name: b.name,
            type: 'building',
            children: rooms.map(r => {
              const inventories = this.getInventoryByRoomId(r._id) || []
              return {
                id: r._id,
                name: r.name,
                children: inventories.map(i => ({
                  id: i._id,
                  name: i.name,
                  type: 'shareableUnit',
                })),
                type: 'room',
              }
            }),
          }
        })
      }
    },

    data: () => ({
      open: [],
      selected: null
    }),

    methods: {
      ...mapActions({
        removeShareableUnit: 'shareableUnits/removeAction'
      }),
      getIcon(type) {
        switch (type) {
          case 'building':
            return 'mdi-bank'
          case 'room':
            return 'mdi-view-quilt'
          default:
            return 'mdi-desktop-classic'
        }
      },
      getRemoveItemDialogTitle(item) {
        switch (item.type) {
          case 'building':
            return `Gebäude  ${item.name} entfernen`
          case 'room':
            return `Raum  ${item.name} entfernen`
          default:
            return `Buchbare Einheit  ${item.name} entfernen`
        }
      },
      getNodeLabel(type) {
        switch (type) {
          case 'building':
            return 'dieses Gebäude inkl. aller enthaltenen Räume sowie buchbaren Einheiten'
          case 'room':
            return 'diesen Raum inkl. aller enthaltenen buchbaren Einheiten'
          default:
            return 'diese buchbare Einheit'
        }
      },
      getRemoveItemDialogDescription(item) {
        return `Bitte bestätigen Sie, dass Sie ${this.getNodeLabel(item.type)} löschen möchten!`
      },
    }
  }
</script>
