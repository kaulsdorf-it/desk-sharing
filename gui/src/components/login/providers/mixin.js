export const mixin = {
  methods: {
    back() {
      this.$emit('back')
    },
  },

  props: {
    authProvider: {
      type: Object,
      required: true,
    },
    showLinkBack: {
      type: Boolean,
      required: true,
    }
  }
}
