import BtnSubmit from './buttons/btn-submit'
import BtnCancel from './buttons/btn-cancel'
import Confirm from './confirm-dialog'
import Dialog from './dialog'

export const registerGeneralComponents = Vue => {
  Vue.component('btn-submit', BtnSubmit)
  Vue.component('btn-cancel', BtnCancel)
  Vue.component('confirm-dialog', Confirm)
  Vue.component('kit-dialog', Dialog)
}
