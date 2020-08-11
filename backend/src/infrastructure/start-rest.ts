const config = require('../config')

let conn

export const startRestServer = async server => {
  return new Promise((resolve, reject) => {
    conn = server.listen(
      config.server.port,
      err => {
        if (err) {
          console.log('=! Server does NOT listening!', err)
          reject(err)
        } else {
          console.log('= Server listens on port ' + config.server.port + ' bind to ip address ' + config.server.host + '  =')
          resolve(conn)
        }
      }
    )
  })
}

export const closeConnection = () => {
  if (conn) {
    conn.close()
  }
}
