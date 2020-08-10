<template>
  <component
    :is="component"
    :item="item"
    @close="$emit('close')"
  />
</template>

<script>
  import EditBuilding from './building'
  import EditRoom from './room'
  import EditShareableUnit from './shareable-unit'

  export default {
    computed: {
      component() {
        switch (this.item.type) {
          case 'building':
            return EditBuilding
          case 'room':
            return EditRoom
          default:
            return EditShareableUnit
        }
      }
    },

    props: {
      item: {
        type: Object,
        required: true,
      },
    },
  }
</script>
