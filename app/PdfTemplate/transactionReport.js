var html_to_pdf = require('html-pdf-node')

let options = { format: 'A4' }

exports.transactionReport = async (transactions) => {
  const template = `<!DOCTYPE html>
  <html>
  <head>
  </head>
  <body style="margin:10px;color: rgb(18, 18, 97);">
      <div style="justify-content: center;align-items: center;display: flex;">
          <table style="border: 1px solid lightgray;border-radius: 5px;background-color: rgb(231, 230, 230);">
              <thead style="font-family:sans-serif;font-weight: 300;font-size:small;">
                <tr>
                  <th>Date of Transaction</th>
                  <th>Fund Name</th>
                  <th>Narration</th>
                  <th>Invested Amount</th>
                  <th>WithDrawal Amount</th>
                  <th>Current Value</th>
                  <th>Total Balance</th>
                </tr>
              </thead>
              <tbody style="font-family:sans-serif;font-weight: 300;font-size:small;">
              ${transactions.map((data) => {
                return `<tr>
                <td>${new Date(data.date).toLocaleDateString()}</td>
                <td>${data.fundname}</td>
                <td>${data.narration}</td>
                <td>${data.investedAmount}</td>
                <td>${data.withdrawalAmount}</td>
                <td>${data.currentValue}</td>
                <td>${data.totalInvested}</td>
              </tr>`
              })}
              </tbody>
            </table>
      </div>
  </body>
  </html>`
  let file = {
    content: template,
    name: 'example.pdf',
  }
  const buffer = await html_to_pdf.generatePdf(file, options)
  return buffer
}
