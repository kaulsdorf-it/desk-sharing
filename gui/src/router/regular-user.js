import Login from '../components/login/index'
import AboutUs from '../components/app/about-us/index'
import BookShareableUnit from '../components/book-shareable-unit'

export default [
  {
    name: 'login',
    path: '/login',
    component: Login,
    meta: {
      title: 'Anmeldung',
      requiresAuth: false,
    }
  },
  {
    name: 'about-us',
    path: '/about-us',
    component: AboutUs,
    meta: {
      title: 'Über uns',
      requiresAuth: false,
    }
  },
  {
    name: 'book-shareable-unit',
    path: '/book-shareable-unit',
    component: BookShareableUnit,
    meta: {
      requiresAuth: true,
      title: 'Desk buchen',
    },
  },
]
