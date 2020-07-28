describe('Authentication', () => {
  it('open start page contains when logged out', () => {
    cy.visit('/')
    cy.contains('Anmeldung')
  })

  it('login form shows an error on failure', () => {
    cy.login({ username: 'badUsername', password: 'badPassword' })
    cy.contains('Der Anmeldename ist dem Active Directory unbekannt oder das Kennwort ist falsch.')
  })

  it('login form redirects to the home page on success', () => {
    cy.login()
  })

  it('does not show login link when already logged in', () => {
    cy.get('a').should('not.contain', 'Log in')
  })

  it('logs the user out when clicking on the "Log out" button', () => {
    cy.logout()
  })
})
