<template>
  <ValidationObserver v-slot="{ invalid }">
    <v-stepper-content :step="step" :test="setFormValidity(!invalid)" style="height: calc(100vh - 397px); overflow-y: auto;">
      <span class="pt-5 pb-3 subtitle-1 pr-6">Verantwortlichkeiten</span>
      <edit-authority
        :authorityType="authorityType"
        :key="authorityType.value"
        v-for="authorityType of authorityTypes"
      />
    </v-stepper-content>
  </ValidationObserver>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { mixin } from '../mixin'
  import EditAuthority from './edit-authority'
  import { stepMixin } from '../step-mixin'

  export default {
    components: {
      EditAuthority,
    },

    computed: {
      ...mapGetters({
        authorityTypes: 'serverConfig/getAuthorityTypes',
      }),
    },

    created() {
      this.authorities = this.authorityTypes.map(authorityType => ({
        description: null,
        contactData: null,
        authorityType: authorityType.value,
      }))
    },

    data() {
      return {
        companyName: null,
        organizationalUnitName: null,
        authorities: [],
        rules: {
          companyName: {
            required: true,
            min: 5,
          },
          organizationalUnitName: {
            required: true,
            min: 5,
          },
        },
      }
    },

    methods: {
      setFormValidity(isValid) {
        this.$emit('stepIsValid', isValid)
      }
    },

    mixins: [mixin, stepMixin],
  }
</script>
