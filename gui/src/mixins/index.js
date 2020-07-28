import Vue from 'vue'

import { EventBus } from '../event-bus'
import { mapGetters } from 'vuex'

import { getToken } from '../plugins/socket-io'

import mongoose from 'mongoose'
import axios from 'axios'

export default () => {
  Vue.mixin({
    computed: {
      ...mapGetters({
        user: 'login/user',
        userIsLoggedIn: 'login/userIsLoggedIn',
      }),
      isSignedIn() {
        return this.userIsLoggedIn
      },
      isAdmin() {
        return this.user && this.user.roles.some(item => item === 'admin')
      },
    },

    methods: {
      showToast(data) {
        EventBus.$emit('appMessage', data)
      },
      isAllowed(roleNeeded) {
        roleNeeded = Array.isArray(roleNeeded) ? roleNeeded : [roleNeeded]

        const userHasRoles = this.$store.getters['login/user'] ? this.$store.getters['login/user'].roles : null

        if (!userHasRoles) {
          return false
        }

        return roleNeeded.some(requiredRole => userHasRoles.indexOf(requiredRole) !== -1)
      },
      userNotAllowedHere(roleNeeded) {
        return !this.isAllowed(roleNeeded)
      },
      createId() {
        return mongoose.Types.ObjectId().toString()
      },
      getDownloadLink(fileName) {
        let url = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port

        if (fileName.substr(0, 1) !== '/') {
          url += '/'
        }

        if (fileName.indexOf('/uploads') === -1) {
          url += 'uploads/'
        }

        return `${url}${fileName}`
      },
      textHighlight: function(content, searchString) {
        if (!content || content.toString().length === 0) {
          return ''
        }

        if (content instanceof Date) {
          return content
        }

        if (!searchString || searchString.toString().length < 1) {
          return content !== true ? content : ''
        }

        const expression = new RegExp(searchString, 'gi')
        content = typeof content !== 'string' ? content.toString() : content

        return content.replace(expression, match => '<span class="highlight-text">' + match + '</span>')
      },
      async downloadFile(downloadUrl, fileName, mimeType) {
        const config = {
          url: downloadUrl,
          method: 'GET',
          responseType: 'blob',
          headers: {
            'Content-Type': mimeType,
            'Authorization': 'Bearer ' + getToken(),
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Request-Headers': 'access-control-allow-methods,access-control-allow-origin,authorization,content-type',
            'Access-Control-Allow-Headers': 'access-control-allow-methods,access-control-allow-origin,authorization,content-type',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE, PUT',
          },
        }
        try {
          const response = await axios(config)

          const fileURL = window.URL.createObjectURL(
            new Blob(
              [response.data],
              {
                type: response.headers['content-type']
              }
            )
          )

          const fileLink = document.createElement('a')

          fileLink.href = fileURL
          fileLink.setAttribute('download', fileName)
          document.body.appendChild(fileLink)

          fileLink.click()
        } catch (error) {
          console.error(error)
        }
      },
      navigateToRoute(name, params) {
        this.$router.push({ name, params })
      }
    }
  })
}
