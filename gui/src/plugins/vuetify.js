import Vue from 'vue'
import Vuetify from 'vuetify'
import de from 'vuetify/es5/locale/de'
import 'vuetify/dist/vuetify.min.css'

export default new Vuetify({
  dark: true,
  lang: {
    locales: { de },
    current: 'de'
  },
  iconfont: 'fa4',
  icons: {
    iconfont: 'mdi',
  },
})

// noinspection JSCheckFunctionSignatures
Vue.use(Vuetify)
