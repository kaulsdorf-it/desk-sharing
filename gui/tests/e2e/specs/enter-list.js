describe('Enter-list', () => {
  it('visit enter-list by the menu', () => {
    cy.bypassLogin()
    cy.wait(500)
    cy.resetAccessRights()
    cy.get('#app-menu').contains('Betretenliste').click()

    cy.url().should('contains', '/enter-list')
    cy.contains('Betretenliste')
  })

  it('ban enter-list read', () => {
    cy.visit('nuetools/lists')

    cy.get('.v-tabs').contains('Betretung').should('not.exist')
  })

  it('allow enter-list read', () => {
    cy.setAccess('enterList', 'readItem')

    cy.visit('nuetools/lists/enter-list')

    cy.get('.v-tabs__item').contains('Betretung')
  })

  it('ban enter-list add', () => {
    cy.visit('nuetools/lists/enter-list')

    cy.get('.v-tabs__item').contains('Betretung').click()

    cy.get('.add-entry-button').should('be.disabled')
  })

  it('allow enter-list add', () => {
    cy.setAccess('enterList', 'addItem')

    cy.visit('nuetools/lists/enter-list')

    cy.get('.v-tabs__item').contains('Betretung').click()

    cy.get('.add-entry-button').should('be.enabled')
  })

  it('add new enter-report', () => {
    cy.visit('nuetools/lists/enter-list')
    cy.get('.add-entry-button').contains('Neu').click()

    cy.get('label').contains('Netzwerk-Element').next('div').click()
    cy.get('.menuable__content__active').contains('BKZ_---BF81WE / Bad Krozingen').click({ force: true })

    cy.vAutocompleteSelectItem('#add-entry #enterReason', 'Betretungsgrund', 'Sonstiges')

    cy.vTextFieldType('#add-entry #person', 'Person und Rufnummer', 'Joejoe / 012345')

    cy.vSelectSelectItem('#add-entry #batteryTestStatus', 'Status des Batterietests', 'gestartet')

    cy.vTextFieldType('#add-entry #notes', 'Notiz', 'Einfach nur so...')

    cy.get('#add-entry').contains('Speichern').click()

    cy.get('.grid').children().should('have.length', 2).contains('BKZ_---BF81WE')
  })

  it('ban enter-list update', () => {
    cy.visit('nuetools/lists/enter-list')

    cy.get('.v-tabs__item').contains('Betretung').click()

    cy.get('.grid .grid-row:nth-child(2) button').first().should('be.disabled')
  })

  it('allow enter-list update', () => {
    cy.setAccess('enterList', 'updateItem')

    cy.visit('nuetools/lists/enter-list')

    cy.get('.v-tabs__item').contains('Betretung').click()

    cy.get('.grid .grid-row:nth-child(2) button').first().should('be.enabled')
  })

  it('update enter-report', () => {
    cy.visit('nuetools/lists/enter-list')

    cy.get('.grid .grid-row:nth-child(2) button').first().click()

    cy.vTextFieldType('#edit-entry #person', 'Person und Rufnummer', 'JoeMcMillan / 678890')

    cy.vTextFieldType('#edit-entry #notes', 'Notiz', 'Bin wieder weg!')

    cy.vSelectSelectItem('#edit-entry #status', 'Status', 'verlassen')

    cy.vSelectSelectItem('#edit-entry #batteryTestStatus', 'Status des Batterietests', 'beendet')

    cy.get('#edit-entry').contains('Speichern').click()

    cy.get('.grid').children().should('have.length', 2).contains('Bin wieder weg!')
  })
})
