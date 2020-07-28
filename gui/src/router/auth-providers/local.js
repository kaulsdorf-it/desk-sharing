import ConfirmUserAccountRegistration from '../../components/confirm-user-account-registration/index'
import ChangePassword from '../../components/login/providers/local/change-password'

export default [
  {
    name: 'confirm-user-account',
    path: '/confirm-user-account/:userAccountId',
    component: ConfirmUserAccountRegistration,
    meta: {
      title: 'Benutzerkonto bestätigen!',
      requiresAuth: false,
    }
  },
  {
    name: 'change-password',
    path: '/change-password/:token',
    component: ChangePassword,
    meta: {
      title: 'Mein Kennwort Ändern',
      requiresAuth: false,
    }
  },
]
