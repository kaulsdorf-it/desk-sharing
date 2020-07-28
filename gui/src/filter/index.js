import { registerNumberFilter } from './number'
import { registerCurrencyFilter } from './currency'

export default (Vue) => {
  registerNumberFilter(Vue)
  registerCurrencyFilter(Vue)
}
