export const getMenuItemsForAdmin = usersNotYetCleared => ({
  menuItemManageUsers: {
    to: { name: 'manage-users' },
    color: 'success',
    icon: 'mdi-account-group',
    label: 'Benutzerverwaltung',
  },

  menuItemNewAndConfirmedLocalUsers: {
    to: { name: 'new-and-confirmed-local-users' },
    color: 'info',
    icon: 'mdi-account-group',
    label: 'Lokale Benutzer freischalten',
    showIndicator: usersNotYetCleared.length > 0,
  },

  menuItemManageMailServer: {
    to: { name: 'manage-mail-servers' },
    color: 'info',
    icon: 'mdi-at',
    label: 'E-Mail Server',
  },

  menuItemInventories: {
    to: { name: 'manage-shareable-units' },
    color: 'default',
    icon: 'mdi-view-dashboard',
    label: 'Buchbare Einheiten verwalten',
  },
})
