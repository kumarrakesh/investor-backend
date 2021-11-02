var html_to_pdf = require('html-pdf-node')

let options = { format: 'A4' }

exports.transactionReport = async (transactions) => {
  const template = `<!DOCTYPE html>
  <html>
  <head>
  </head>
  <body style="margin:50px;color: rgb(18, 18, 97);">
      <div style="justify-content:center;align-items: center;display: flex;">
          <table style="border: 1px solid lightgray;border-radius: 5px;background-color: rgb(231, 230, 230);">
              <thead style="font-family:sans-serif;font-weight: 300;font-size:small;">
                <tr>
                  <th>Date</th>
                  <th>FundName</th>
                  <th>Narration</th>
                  <th>Invested</th>
                  <th>WithDrawal</th>
                  <th>Current Value</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody style="font-family:sans-serif;font-weight: 300;font-size:small;">
              ${transactions
                .map((data) => {
                  return `<tr>
                <td style="border-right:1px solid lightgray;align">${new Date(
                  data.date
                ).toLocaleDateString()}</td>
                <td "border-right:1px solid black;display: flex;align-items: center;justify-content: center;padding:10px;">${
                  data.fundname
                }</td>
                <td "border-right:1px solid black;margin: 10px;display: flex;align-items: center;justify-content: center;">${
                  data.narration
                }</td>
                <td "border-right:1px solid black;display: flex;align-items: center;justify-content: center;">${
                  data.investedAmount
                }</td>
                <td "border-right:1px solid black;display: flex;align-items: center;justify-content: center;">${
                  data.withdrawalAmount
                }</td>
                <td "border-right:1px solid black;display: flex;align-items: center;justify-content: center;">${
                  data.currentValue
                }</td>
                <td>${data.totalInvested}</td>
              </tr>`
                })
                .join(' ')}
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
