exports.validateEmail = (username) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(username).toLowerCase())
}

exports.validatePassword = (password) => {}

exports.validateFolioNumber = (folioNumber) => {
  const regexAlphaNumeric = /^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]+$/
  const regexAlphaOnly = /^[A-Za-z]+$/
  const regexNumeric = /^[0-9]*$/

  return (
    regexAlphaNumeric.test(folioNumber) ||
    regexAlphaOnly.test(folioNumber) ||
    regexNumeric.test(folioNumber)
  )
}
