describe('Change-order-list', () => {
  it('init', () => {
    cy.bypassLogin()
    cy.wait(500)
    cy.resetAccessRights()
    cy.get('#app-menu').contains('Betretenliste').click()
  })

  it('ban change-order-list read', () => {
    cy.visit('nuetools/lists')

    cy.get('.v-tabs').contains('Change order').should('not.exist')
  })

  it('allow change-order-list read', () => {
    cy.setAccess('changeOrderList', 'readItem')

    cy.visit('nuetools/lists')

    cy.get('.v-tabs__item').contains('Change Order')
  })

  it('ban change-order-list update', () => {
    cy.visit('nuetools/lists')

    cy.get('.v-tabs__item').contains('Change Order').click()

    cy.get('.grid .grid-row:nth-child(2) button').first().should('be.disabled')
  })

  it('allow change-order-list update', () => {
    cy.setAccess('changeOrderList', 'updateItem')

    cy.visit('nuetools/lists')

    cy.get('.v-tabs__item').contains('Change Order').click()

    cy.get('.grid .grid-row:nth-child(2) button').first().should('be.enabled')
  })
})
