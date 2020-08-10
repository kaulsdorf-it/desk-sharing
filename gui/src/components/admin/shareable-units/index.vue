<template>
  <v-container fluid>
    <v-row>
      <v-col class="pr-2" cols="4">
        <list
          @select="select"
        />
      </v-col>
      <v-col class="pl-2" cols="8">
        <edit :item="selected" @close="selected = null" v-if="selected"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import Edit from './edit'
  import List from './list'

  export default {
    components: {
      Edit,
      List,
    },

    data: () => ({
      selected: null,
    }),

    methods: {
      select(item) {
        this.selected = item
      }
    }
  }
</script>
