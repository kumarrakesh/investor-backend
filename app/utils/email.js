const SibApiV3Sdk = require('sib-api-v3-sdk')
const defaultClient = SibApiV3Sdk.ApiClient.instance
var apiKey = defaultClient.authentications['api-key']
apiKey.apiKey = process.env.SENDINBLUE_API_KEY
var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()

const sendQueryEmail = async (newQuery, res) => {
  var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()
  sendSmtpEmail = {
    sender: {
      name: 'Investor',
      email: 'noreply@investor.com',
    },
    to: [
      {
        email: process.env.ADMIN_EMAIL,
        name: process.env.ADMIN_NAME,
      },
    ],
    subject: 'New Query Raised',

    htmlContent: `<h3>Query Id : ${newQuery.queryId}</h3></br><h3>Subject : ${newQuery.subject}</h3></br><h3>Description : ${newQuery.description}</h3>`,
  }

  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data) {
      return res.status(200).json({ status: true, data: newQuery })
    },
    function (error) {
      return res
        .status(200)
        .json({ status: false, error: 'Error in sending email t admin' })
    }
  )
}

module.exports = {
  sendQueryEmail: sendQueryEmail,
}
