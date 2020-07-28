import { mapGetters, mapMutations } from 'vuex'

export const mixin = {
  computed: {
    ...mapGetters({
      config: 'serverConfig/getConfig',
    }),
  },

  methods: {
    ...mapMutations({
      setConfigValue: 'serverConfig/setConfigValueMutation',
      setAuthority: 'serverConfig/setAuthorityMutation',
    }),
    setFormValidity(isValid) {
      this.$emit('stepIsValid', isValid)
    }
  },
}
