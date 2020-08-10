<template>
  <component :is="component" :parent="parent"/>
</template>

<script>
  import NewBuilding from './building'
  import NewRoom from './room'
  import ShareableUnit from './shareable-unit'

  export default {
    components: {
      NewBuilding,
      NewRoom,
    },

    computed: {
      component() {
        switch (this.parent.type) {
          case 'building':
            return NewRoom
          case 'room':
            return ShareableUnit
          default:
            return NewBuilding
        }
      }
    },

    props: {
      parent: {
        type: Object,
        required: true,
      },
      invalid: {
        type: Boolean,
        default: false,
      },
    }
  }
</script>
