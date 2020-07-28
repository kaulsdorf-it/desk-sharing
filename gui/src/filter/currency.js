export const registerCurrencyFilter = (Vue) => {
  Vue.filter('currency', (value, currency) => {
    if (!currency) {
      currency = 'EUR'
    }
    if (value || value === 0) {
      return value.toLocaleString('de-DE', { style: 'currency', currency })
    }
    return ''
  })
}
