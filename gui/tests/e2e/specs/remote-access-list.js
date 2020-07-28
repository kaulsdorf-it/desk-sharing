describe('Remote-access-list', () => {
  it('init', () => {
    cy.bypassLogin()
    cy.wait(500)
    cy.resetAccessRights()
    cy.get('#app-menu').contains('Betretenliste').click()
  })

  it('ban remote-access-list read', () => {
    cy.visit('nuetools/lists')

    cy.get('.v-tabs').contains('Fernwartung').should('not.exist')
  })

  it('allow remote-access-list read', () => {
    cy.setAccess('remoteAccessList', 'readItem')

    cy.visit('nuetools/lists')

    cy.get('.v-tabs__item').contains('Fernwartung')
  })

  it('ban remote-access-list add', () => {
    cy.visit('nuetools/lists')

    cy.get('.v-tabs__item').contains('Fernwartung').click()

    cy.get('.add-entry-button').should('be.disabled')
  })

  it('allow remote-access-list add', () => {
    cy.setAccess('remoteAccessList', 'addItem')

    cy.visit('nuetools/lists')

    cy.get('.v-tabs__item').contains('Fernwartung').click()

    cy.get('.add-entry-button').should('be.enabled')
  })

  it('add new remote-access-list item', () => {
    cy.visit('nuetools/lists')

    cy.get('.v-tabs__item').contains('Fernwartung').click()

    cy.get('.add-entry-button').click()

    cy.vTextFieldType('.v-dialog--active #contactData', 'Name und Rufnummer', 'Joejoe / 012345')
    cy.vSelectSelectItem('.v-dialog--active #reason', 'Grund der Freischaltung', 'Siehe Notiz')
    cy.vTextFieldType('.v-dialog--active #revokeTime', 'Ende', '23:59')
    cy.vTextFieldType('.v-dialog--active #note', 'Notiz', 'Einfach nur so...')
    cy.vSelectSelectItem('.v-dialog--active #grantedToUser', 'Nach Benutzern suchen ...', 'NK0004')

    cy.get('.v-dialog--active').contains('Erteilen').click()

    cy.get('.grid').children().should('have.length', 2).contains('Einfach nur so...')
  })

  it('ban remote-access-list update', () => {
    cy.visit('nuetools/lists')

    cy.get('.v-tabs__item').contains('Fernwartung').click()

    cy.get('.grid .grid-row:nth-child(2) button').first().should('be.disabled')
  })

  it('allow remote-access-list update', () => {
    cy.setAccess('remoteAccessList', 'updateItem')

    cy.visit('nuetools/lists')

    cy.get('.v-tabs__item').contains('Fernwartung').click()

    cy.get('.grid .grid-row:nth-child(2) button').first().should('be.enabled')
  })

  it('update remote-access-list item', () => {
    cy.visit('nuetools/lists')

    cy.get('.v-tabs__item').contains('Fernwartung').click()

    cy.get('.grid .grid-row:nth-child(2) button').first().click()

    cy.vTextFieldType('.v-dialog--active #note', 'Notiz', 'Anderer Text')

    cy.get('.v-dialog--active').contains('Anpassen').click()

    cy.get('.grid').children().should('have.length', 2).contains('Anderer Text')
  })

  it('ban remote-access-list remove', () => {
    cy.visit('nuetools/lists')

    cy.get('.v-tabs__item').contains('Fernwartung').click()

    cy.get('.grid .grid-row:nth-child(2) button').eq(1).should('be.disabled')
  })

  it('allow remote-access-list remove', () => {
    cy.setAccess('remoteAccessList', 'removeItem')

    cy.visit('nuetools/lists')

    cy.get('.v-tabs__item').contains('Fernwartung').click()

    cy.get('.grid .grid-row:nth-child(2) button').eq(1).click()

    cy.get('.v-dialog--active').contains('Ja').click()

    cy.get('.grid').children().should('have.length', 1)
  })
})
