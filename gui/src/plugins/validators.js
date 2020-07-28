import Vue from 'vue'
import { extend, setInteractionMode, ValidationObserver, ValidationProvider } from 'vee-validate'
import { messages } from 'vee-validate/dist/locale/de.json'
import * as rules from 'vee-validate/dist/rules'
import { socket } from './socket-io'

export const installFormValidators = () => {
  setInteractionMode('eager')

  // register all build-in rules
  Object.keys(rules).forEach(rule => extend(rule, { ...rules[rule], message: messages[rule] }))

  // custom rules..

  // for (multiple) checkboxes
  extend('arrayMinSize', {
    params: ['arrayMinSize'],
    message: 'Im Abschnitt {_field_} müssen mindestens {arrayMinSize} Punkte ausgewählt werden.',
    validate: (value, { arrayMinSize }) => value.length >= arrayMinSize
  })

  // for (multiple) checkboxes
  extend('arrayMaxSize', {
    params: ['arrayMaxSize'],
    message: 'Im Abschnitt {_field_} dürfen maximal {arrayMaxSize} Punkte ausgewählt werden.',
    validate: (value, { arrayMaxSize }) => value.length <= arrayMaxSize,
  })

  extend('numberWithMinAndMaxDigits', {
    params: ['min', 'max'],
    message: (field, { min, max }) => min === max
      ? `Die Zahl muss genau ${min} Ziffern haben!`
      : `Die Zahl muss min. ${min} und max. ${max} Ziffern haben!`,
    validate: (value, { min, max }) => {
      return value !== null && value.length >= min && value.length <= max
    }
  })

  extend('regexp', {
    params: ['expression', 'errorMsg'],
    message: (field, { errorMsg }) => errorMsg,
    validate: (value, { expression }) => new RegExp(expression).test(value),
  })

  extend('mustBeTrue', {
    message: 'Muss ausgewählt werden!',
    validate: value => !!value,
  })

  extend('accountNameMustNotExist', {
    message: 'Dieser Benutzername existiert bereits. Bitte wählen einen anderen!',
    params: ['authProviderId'],
    validate: (userAccount, { authProviderId }) => {
      socket.send('does-user-account-already-exist', { userAccount, authProviderId })
      return new Promise(resolve => {
        socket.once('DOES_USER_ACCOUNT_ALREADY_EXIST_RESPONSE', invalid => {
          resolve(!invalid)
        })
      })
    }
  })

  extend('mailMustNotExistInUserAccount', {
    message: 'Diese E-Mail-Adresse wird bereits verwendet. Bitte nutzen eine andere, falls Sie ein weiteres Benutzerkonto erstellen möchten!',
    params: ['authProviderId', 'ownAccountId'],
    validate: (mail, { authProviderId, ownAccountId }) => {
      socket.send('does-mail-already-exist-in-any-user-account', { mail, authProviderId, ownAccountId })
      return new Promise(resolve => {
        socket.once('DOES_MAIL_ALREADY_EXIST_IN_ANY_USER_ACCOUNT_RESPONSE', invalid => {
          resolve(!invalid)
        })
      })
    }
  })

  extend('mailDomainMustExist', {
    message: 'Die Domain dieser E-Mail-Adresse ist unbekannt.',
    validate: (mailAddress) => {
      socket.emit('check-mail-address', mailAddress)
      return new Promise(resolve => {
        socket.once('check_mail_address_success', ({ isValid }) => {
          resolve(isValid)
        })
      })
    }
  })

  extend('password', {
    params: ['target'],
    validate: (value, { target }) => value === target,
    message: 'Die Kennwörter stimmen nicht überein.'
  })

  Vue.component('ValidationProvider', ValidationProvider)
  Vue.component('ValidationObserver', ValidationObserver)
}
