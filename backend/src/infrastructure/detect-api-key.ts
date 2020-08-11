export const detectApiKey = (req, res, next) => {
  const authValue = req.headers.authorization
  if (authValue) {
    if (authValue.indexOf('Bearer ') === 0) {
      const apiKey = authValue.substr(7)
      if (apiKey) {
        req.apiKey = apiKey.trim()
      }
    }
  }

  next()
}
