// Create custom Cypress commands and overwrite existing ones.
// https://on.cypress.io/custom-commands

const DEFAULT_USER = 'robert'
const DEFAULT_PW = 'robert'

Cypress.Commands.add('login', ({ username, password } = {}) => {
  // Visit the login page
  cy.visit('/login')

  // Enter the user-supplied username and password, with valid fallbacks.
  cy.get('#username').clear().type(username || DEFAULT_USER)
  cy.get('#password').clear().type(password || DEFAULT_PW)

  // Submit the login form
  cy
    .get('button')
    .contains('Login')
    .click()

  // If the user did not provide a custom username or password,
  // then assume success and wait for a redirect to the homepage.
  if (!username && !password) {
    cy.contains('Betretenliste')
  }
})

Cypress.Commands.add('logout', () => {
  // Find the logout button
  cy.get('#menu-logout').click()

  // User should be on login page
  cy.url().should('include', '/login')
  cy.contains('Anmeldung')
})

Cypress.Commands.add('bypassLogin', () => {
  cy.visit('/')

  const getSocket = () => cy.window().its('app.$socket')

  getSocket().then(socket => {
    socket.emit('login', { username: DEFAULT_USER, password: DEFAULT_PW })
  })
})

Cypress.Commands.add('resetAccessRights', () => {
  cy.visit('/')

  const getSocket = () => cy.window().its('app.$socket')

  getSocket().then(socket => {
    console.log('emit rights')
    socket.emit('update.appAccessRights', [
      { 'groups': [], '_id': '5d5aa29d604ac817b079e510', 'feature': 'enterList', 'right': 'readItem', '__v': 0 },
      { 'groups': [], '_id': '5d5aa29d604ac817b079e511', 'feature': 'enterList', 'right': 'addItem', '__v': 0 },
      { 'groups': [], '_id': '5d5aa29d604ac817b079e512', 'feature': 'enterList', 'right': 'updateItem', '__v': 0 },
      { 'groups': [], '_id': '5d5aa29d604ac817b079e513', 'feature': 'genericLists', 'right': 'readItem', '__v': 0 },
      { 'groups': [], '_id': '5d5aa29d604ac817b079e514', 'feature': 'genericLists', 'right': 'addItem', '__v': 0 },
      { 'groups': [], '_id': '5d5aa29d604ac817b079e515', 'feature': 'genericLists', 'right': 'updateItem', '__v': 0 },
      { 'groups': [], '_id': '5d5aa29d604ac817b079e516', 'feature': 'genericLists', 'right': 'removeItem', '__v': 0 },
      { 'groups': [], '_id': '5d5aa29d604ac817b079e517', 'feature': 'genericLists', 'right': 'addList', '__v': 0 },
      { 'groups': [], '_id': '5d5aa29d604ac817b079e518', 'feature': 'genericLists', 'right': 'updateList', '__v': 0 },
      { 'groups': [], '_id': '5d5aa29d604ac817b079e519', 'feature': 'genericLists', 'right': 'removeList', '__v': 0 },
      { 'groups': [], '_id': '5d5aa29d604ac817b079e520', 'feature': 'changeOrderList', 'right': 'readItem', '__v': 0 },
      { 'groups': [], '_id': '5d5aa29d604ac817b079e521', 'feature': 'changeOrderList', 'right': 'updateItem', '__v': 0 },
      { 'groups': [], '_id': '5d5aa29d604ac817b079e522', 'feature': 'remoteAccessList', 'right': 'readItem', '__v': 0 },
      { 'groups': [], '_id': '5d5aa29d604ac817b079e523', 'feature': 'remoteAccessList', 'right': 'addItem', '__v': 0 },
      { 'groups': [], '_id': '5d5aa29d604ac817b079e524', 'feature': 'remoteAccessList', 'right': 'updateItem', '__v': 0 },
      { 'groups': [], '_id': '5d5aa29d604ac817b079e525', 'feature': 'remoteAccessList', 'right': 'removeItem', '__v': 0 }
    ])
  })
})

/*
  Vuetify elements
 */

Cypress.Commands.add('vAutocompleteSelectItem', (inputId, labelText, itemToSelect) => {
  cy.get(inputId).click().prev('label').contains(labelText)
  cy.get('.menuable__content__active').contains(itemToSelect).click()
})

Cypress.Commands.add('vSelectSelectItem', (inputId, labelText, itemToSelect) => {
  cy.get(inputId).parent().prev('label').contains(labelText).next('.v-select__selections').click()
  cy.get('.menuable__content__active').contains(itemToSelect).click()
})

Cypress.Commands.add('vTextFieldType', (inputId, labelText, textToType) => {
  cy.get(inputId).click().prev('label').contains(labelText)
  cy.focused().clear().type(textToType)
})

Cypress.Commands.add('setAccess', (feature, right) => {
  cy.visit('nuetools/admin/manage-user-access')

  cy.get(`#${feature}-${right}`).click()
    .get('.menuable__content__active').contains('BF Ost').click()

  cy.get('#save-access-right').click()
})
