describe('Generic-lists', () => {
  it('init', () => {
    cy.bypassLogin()
    cy.wait(500)
    cy.resetAccessRights()
    cy.get('#app-menu').contains('Betretenliste').click()
  })

  it('ban generic-lists add list', () => {
    cy.visit('nuetools/lists')

    cy.get('.v-tabs').contains('Neue Liste').should('not.exist')
  })

  it('allow generic-lists add list', () => {
    cy.setAccess('genericLists', 'addList')

    cy.visit('nuetools/lists')

    cy.get('.v-tabs__item').contains('Neue Liste').click()

    cy.vTextFieldType('#addGenericListName', 'Name der Liste', 'Cypress-Liste')

    cy.get('#addGenericListSave').contains('Jetzt anlegen').click()

    cy.contains('Cypress-Liste')
  })

  it('ban generic-lists read item', () => {
    cy.visit('nuetools/lists')

    cy.get('.v-tabs').contains('Cypress-Liste').should('not.exist')
  })

  it('allow generic-lists read item', () => {
    cy.setAccess('genericLists', 'readItem')

    cy.visit('nuetools/lists')

    cy.get('.v-tabs').contains('Cypress-Liste').should('exist')
  })

  it('ban generic-lists add item', () => {
    cy.visit('nuetools/lists')

    cy.get('.v-tabs__item').contains('Cypress-Liste').click()

    cy.get('.add-entry-button').should('be.disabled')
  })

  it('allow generic-lists add item', () => {
    cy.setAccess('genericLists', 'addItem')

    cy.visit('nuetools/lists')

    cy.get('.v-tabs__item').contains('Cypress-Liste').click()

    cy.get('.add-entry-button').should('be.enabled')
  })

  it('ban generic-lists update list', () => {
    cy.setAccess('genericLists', 'addList') // remove right

    cy.visit('nuetools/lists')

    cy.get('.v-tabs__item').contains('Cypress-Liste').click()

    cy.get('#show-definition').should('not.exist')
  })

  it('allow generic-lists update list', () => {
    cy.setAccess('genericLists', 'updateList')

    cy.visit('nuetools/lists')

    cy.get('.v-tabs__item').contains('Cypress-Liste').click()

    cy.get('#show-definition').contains('Liste anpassen')
  })

  it('update generic-lists list', () => {
    cy.visit('nuetools/lists')

    cy.get('.v-tabs__item').contains('Cypress-Liste').click()

    cy.get('#show-definition').contains('Liste anpassen').click()

    cy.get('#addColumn').click()

    cy.get('.v-dialog--active').contains('Speichern').click()

    cy.get('.grid').children().contains('Neue Spalte')
  })

  it('ban generic-lists remove list', () => {
    cy.visit('nuetools/lists')

    cy.get('.v-tabs__item').contains('Cypress-Liste').click()

    cy.get('#show-definition').contains('Liste anpassen').click()

    cy.get('#removeList').contains('Liste löschen').should('be.disabled')
  })

  it('allow generic-lists remove list', () => {
    cy.setAccess('genericLists', 'removeList')

    cy.visit('nuetools/lists')

    cy.get('.v-tabs__item').contains('Cypress-Liste').click()

    cy.get('#show-definition').contains('Liste anpassen').click()

    cy.get('#removeList').contains('Liste löschen').should('be.enabled')
  })

  it('add new generic-list item', () => {
    cy.visit('nuetools/lists')

    cy.get('.v-tabs__item').contains('Cypress-Liste').click()

    cy.get('.add-entry-button').click()

    cy.focused().type('Mein persönlicher Test')

    cy.get('.v-dialog--active').contains('Hinzufügen').click()

    cy.get('.grid').children().should('have.length', 2).contains('Mein persönlicher Test')
  })

  it('ban generic-lists update item', () => {
    cy.visit('nuetools/lists')

    cy.get('.v-tabs__item').contains('Cypress-Liste').click()

    cy.get('.grid .grid-row:nth-child(2) button').first().should('be.disabled')
  })

  it('allow generic-lists update item', () => {
    cy.setAccess('genericLists', 'updateItem')

    cy.visit('nuetools/lists')

    cy.get('.v-tabs__item').contains('Cypress-Liste').click()

    cy.get('.grid .grid-row:nth-child(2) button').first().should('be.enabled')
  })

  it('update generic-lists item', () => {
    cy.visit('nuetools/lists')

    cy.get('.v-tabs__item').contains('Cypress-Liste').click()

    cy.get('.grid .grid-row:nth-child(2) button').first().click()

    cy.focused().clear().type('Anderer Text')

    cy.get('.v-dialog--active').contains('Änderungen speichern').click()

    cy.get('.grid').children().should('have.length', 2).contains('Anderer Text')
  })

  it('ban generic-lists remove item', () => {
    cy.visit('nuetools/lists')

    cy.get('.v-tabs__item').contains('Cypress-Liste').click()

    cy.get('.grid .grid-row:nth-child(2) button').eq(1).should('be.disabled')
  })

  it('allow generic-lists remove item', () => {
    cy.setAccess('genericLists', 'removeItem')

    cy.visit('nuetools/lists')

    cy.get('.v-tabs__item').contains('Cypress-Liste').click()

    cy.get('.grid .grid-row:nth-child(2) button').eq(1).click()

    cy.get('.v-dialog--active').contains('Ja').click()

    cy.get('.grid').children().should('have.length', 2).contains('geschlossen')
  })
})
