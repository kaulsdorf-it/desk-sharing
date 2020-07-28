import Admin from '../components/admin/index'
import NewAndConfirmedLocalUsers from '../components/admin/new-and-confirmed-local-users/index'
import UsersSelectUser from '../components/admin/users/index'
import UsersManageUser from '../components/admin/users/manage-user'
import ManageMailServer from '../components/admin/mail-server'
import ManageSingleMailServer from '../components/admin/mail-server/manage-single-mail-server'

export default [
  {
    name: 'admin',
    path: '/admin',
    component: Admin,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: 'new-and-confirmed-local-users',
        name: 'new-and-confirmed-local-users',
        component: NewAndConfirmedLocalUsers,
        meta: {
          title: 'Anwender freischalten',
          requiredRole: ['admin'],
        },
      },
      //{
      //  path: 'form-api-keys',
      //  name: 'form-api-keys',
      //  component: FormApiKeys,
      //  meta: {
      //    title: 'API-Keys verwalten',
      //    requiredRole: ['admin'],
      //  },
      //  children: [
      //    {
      //      path: ':formApiKeyId',
      //      name: 'form-api-key',
      //      component: FormApiKey,
      //    }
      //  ]
      //},
      {
        name: 'manage-users',
        path: 'manage-users',
        component: UsersSelectUser,
        meta: {
          title: 'Benutzerverwaltung',
          requiredRole: ['admin'],
        },
        children: [{
          name: 'manage-user',
          path: ':userName/:userId',
          component: UsersManageUser,
          meta: {
            title: 'Benutzerverwaltung'
          },
        }]
      },
      {
        name: 'manage-mail-servers',
        path: 'manage-mail-servers',
        component: ManageMailServer,
        meta: {
          title: 'E-Mail-Server',
          requiredRole: ['admin'],
        },
        children: [
          {
            path: ':mailServerId',
            name: 'manage-mail-server',
            component: ManageSingleMailServer,
          }
        ]
      }
    ]
  }
]
