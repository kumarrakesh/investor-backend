const html_to_pdf = require('html-pdf-node')

const { merge } = require('merge-pdf-buffers')

// page 1 - 6 nd others 23

const displayTransaction = (t) => {
  var html = `<tr>
        <th style=" padding-top: 12px;
        padding-left: 15px;
        border: 1px solid rgb(107, 106, 106);
        border-radius:10px;
        padding-bottom: 12px;
        font-family: 700;
        background-color: #e8eef9;
        color: rgb(0, 0, 0);">Date</th>
        <th style=" padding-top: 12px;
        padding-left: 15px;
        padding-bottom: 12px;
        border: 1px solid rgb(107, 106, 106);
        font-family: 700;
        background-color: #e8eef9;
        color: rgb(0, 0, 0);">Transaction Description</th>
        <th style=" padding-top: 12px;
        padding-left: 15px;
        padding-bottom: 12px;
        border: 1px solid rgb(107, 106, 106);
        font-family: 700;
        background-color: #e8eef9;
        color: rgb(0, 0, 0);">Distribution</th>
        <th style=" padding-top: 12px;
        padding-left: 15px;
        padding-bottom: 12px;
        border: 1px solid rgb(107, 106, 106);
        font-family: 700;
        background-color: #e8eef9;
        color: rgb(0, 0, 0);">Contribution</th>
        <th style=" padding-top: 12px;
        padding-left: 15px;
        padding-bottom: 12px;
        border: 1px solid rgb(107, 106, 106);
        font-family: 700;
        background-color: #e8eef9;
        color: rgb(0, 0, 0);">Redemption</th>
        </tr>`

  for (var i = t.length - 1; i >= 0; i--) {
    var row = t[i]
    var data = `
     <tr>
     <td style="  border: 1px solid rgb(107, 106, 106);padding:10px;font-size:large;font-weight:500">${new Date(
       row.date
     ).toLocaleString('it-IT', {
       timeZone: 'Asia/Kolkata',
       year: 'numeric',
       month: '2-digit',
       day: 'numeric',
     })}</td>
     <td style="  border: 1px solid rgb(107, 106, 106);padding:10px;">${
       row.type == '1'
         ? 'Contribution'
         : row.type == '3'
         ? 'Redemption'
         : 'Distribution'
     }</td>
     <td style="  border: 1px solid rgb(107, 106, 106);padding:10px;">${
       row.type == '2' ? row.amount : ''
     }</td>
     <td style="  border: 1px solid rgb(107, 106, 106);padding:10px;">${
       row.type == '1' ? row.amount : ''
     }</td>
     <td style="  border: 1px solid rgb(107, 106, 106);padding:10px;">${
       row.type == '3' ? -1 * row.amount : ''
     }</td>
   </tr>`
    html += data
  }
  return html
}

const firstPageTemplate = (user, transaction, userFolio, config) => {
  const template = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <meta
        name="description"
        content="Web site created using create-react-app"
      />
      <!--
        manifest.json provides metadata used when your web app is installed on a
        user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
      -->
  
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Biryani&family=Inter&family=Poppins&display=swap"
        rel="stylesheet"
      />
  
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
        integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
        crossorigin="anonymous"
      />
      <style>
        
  body {margin-top: 0px;margin-left: 0px;}
  
  html { -webkit-print-color-adjust: exact; }
      </style>
      <script
        src="https://kit.fontawesome.com/9f6ba87a3b.js"
        crossorigin="anonymous"
      ></script> 
      <title>PDF</title>
    </head>
    <body>
     <div style="display: flex;flex-direction: row;justify-content: space-around;">
      <div style="width: 10px;height: 80px;background-color:rgb(255, 58, 32);margin-top: 40px;margin-right: -180px;">
  
      </div>
         <div style="margin-top:35px;margin:2% 6%">
            <h2 style="color:rgb(107, 106, 106);">Client Investment Folio Statement</h2>
            <h2>
            ${config.companyName}
            </h2>
         </div>
         <div>
         </div>
     </div>
     <h3 style="padding-left: 120px;">Statement Date : ${new Date().toLocaleString(
       'it-IT',
       {
         timeZone: 'Asia/Kolkata',
         year: 'numeric',
         month: '2-digit',
         day: 'numeric',
       }
     )}</h3>
     <div style="padding: 40px;border: 1px solid rgb(107, 106, 106);margin:2% 6%;border-radius:10px;">
         <h4 style="font-weight: 700;">Personal Information</h4>
         <div  style="display: flex;flex-direction: row;">
           <div><h2 style="color:#2b4b82">${user.name}</h2></div>
           <div style="margin-left: 150px;"><h3 style="color:rgb(107, 106, 106)">| Folio No. <span style="color:#2b4b82">${
             userFolio.folioNumber
           }</span> </h3></div>
           <div style="margin-left: 100px;"><h3 style="color:rgb(107, 106, 106)">| Yield  <span style="color:#2b4b82">${
             userFolio.yield
           }%</span></h3></div>
           <div style="margin-left: 100px;"><h3 style="color:rgb(107, 106, 106)">| Currency  <span style="color:#2b4b82">${
             userFolio.currency
           }</span></h3></div>
         </div>
        
         <div style="display: flex;flex-direction: row;margin-top: 2%;justify-content: space-around;align-items:center;">
             <div style="margin-left: -250px;">
                  <h3 style="color:rgb(107, 106, 106)">Address 1</h3>
                  <h3>${user.address || ''}</h3>
                  <h3 style="color:rgb(107, 106, 106);margin-top: 30px;">Email ID</h3>
                  <h3>${user.email || ''}</h3>
             </div>
             <div style="margin-right: -30px;">
              <h3 style="color:rgb(107, 106, 106)">Address 2</h3>
              <h3>${user.city || ''},${user.state || ''},${
    user.pincode || ''
  } </h3>
              <h3 style="color:rgb(107, 106, 106);margin-top: 30px;">Phone Number</h3>
              <h3>${user.phoneNo || ''}</h3>
             </div>
         </div>
     </div>
     <div>
         <div style=" margin:2% 6%;border: 1px solid rgb(107, 106, 106);;padding:40px;border-radius:10px;">     
          <h4 style="font-weight: 700;margin-bottom: 20px;">Summary of Your Investment</h4>
          <div  style="display: flex;flex-direction: row;justify-content: space-between;">
            <div>
              <h4 style="color:rgb(107, 106, 106);">Capital Commited (USD)</h4>
              <h4 style="color:#2b4b82;font-weight:700;">${
                userFolio.commitment
              }</h4>
          </div>
          <div style="margin-left: 150px;">
              <h4 style="color:rgb(107, 106, 106)">Capital Contributed (USD)</h4>
              <h4 style="color:#2b4b82;font-weight:700;">${
                userFolio.contribution
              }</h4>
          </div>
          <div style="margin-left: 150px;">
              <h4 style="color:rgb(107, 106, 106)">Pending Amount (USD)</h4>
              <h4 style="color:#2b4b82;font-weight:700;">${
                userFolio.commitment - userFolio.contribution
              }</h4>
          </div>
  
          </div>
         
         </div>
     </div>
     <div style="margin:2% 6%;">
         <h4 style="font-weight: 700;border:1px solid rgb(107, 106, 106);margin-bottom: -2px;padding: 30px;">
             ${config.companyName}
         </h4>
  <table style="width:100%;">
      ${displayTransaction(transaction)}
    </table>
     </div">
     <h5 style="margin-top:10px;padding-left: 120px;">Thank you for investing in ${
       config.companyName
     }</h5>
     <div style="margin-bottom: -15px; margin-top: 6%;background-color:#e8eef9;padding:30px;padding-left: 120px;">
         <h5 style="color:rgb(14, 76, 170);font-weight: 700;">${
           config.companyName
         }</h5>
         <p>${config.addressline1}</p>
         <p style="margin-top: -10px;">${config.addressline2}</p>
     </div>
    </body>
  </html>
  `
  return template
}

const nextPageTemplate = (transaction, config) => {
  const template = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <meta
        name="description"
        content="Web site created using create-react-app"
      />
      <!--
        manifest.json provides metadata used when your web app is installed on a
        user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
      -->
  
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Biryani&family=Inter&family=Poppins&display=swap"
        rel="stylesheet"
      />
  
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
        integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
        crossorigin="anonymous"
      />
      <style>
  body {margin-top: 0px;margin-left: 0px;}
  
  html { -webkit-print-color-adjust: exact; }
      </style>
      <script
        src="https://kit.fontawesome.com/9f6ba87a3b.js"
        crossorigin="anonymous"
      ></script> 
      <title>PDF</title>
    </head>
    <body>
     
     <div style="margin:2% 6%;">
         <h4 style="font-weight: 700;border:1px solid rgb(107, 106, 106);margin-bottom: -2px;padding: 30px;">
             ${config.companyName}
         </h4>
  <table style="width:100%;">
      ${displayTransaction(transaction)}         
    </table>
    </div">
     <h5 style="margin-top:10px;padding-left: 120px;">Thank you for investing in ${
       config.companyName
     }</h5>
     <div style="margin-bottom: -15px; margin-top: 6%;background-color:#e8eef9;padding:30px;padding-left: 120px;">
         <h5 style="color:rgb(14, 76, 170);font-weight: 700;">${
           config.companyName
         }</h5>
         <p>${config.addressline1}</p>
         <p style="margin-top: -10px;">${config.addressline2}</p>
     </div>
    </body>
  </html>`

  return template
}

exports.transactionReport = async (user, transaction, userFolio, config) => {
  const options = {
    height: '8.00in',
    width: '8.0in',
    scale: 0.5,
  }

  var pdfsBuffers = []

  var firstPageTrnx

  if (transaction.length < 4) {
    firstPageTrnx = transaction

    let file = {
      content: firstPageTemplate(user, firstPageTrnx, userFolio, config),
      name: 'example.pdf',
    }
    var pdfBuffer = await html_to_pdf.generatePdf(file, options)

    pdfsBuffers.push(pdfBuffer)

    transaction = []
  } else {
    firstPageTrnx = transaction.slice(0, 4)

    let file = {
      content: firstPageTemplate(user, firstPageTrnx, userFolio, config),
      name: 'example.pdf',
    }
    var pdfBuffer = await html_to_pdf.generatePdf(file, options)

    pdfsBuffers.push(pdfBuffer)

    transaction.splice(0, 4)
  }

  var nextPageTrx = []
  while (transaction.length > 0) {
    if (transaction.length > 20) {
      nextPageTrx = transaction.slice(0, 20)

      let file = {
        content: nextPageTemplate(nextPageTrx, config),
        name: 'example.pdf',
      }
      var pdfBuffer = await html_to_pdf.generatePdf(file, options)

      pdfsBuffers.push(pdfBuffer)
      transaction.splice(0, 20)
    } else {
      nextPageTrx = transaction
      let file = {
        content: nextPageTemplate(nextPageTrx, config),
        name: 'example.pdf',
      }
      var pdfBuffer = await html_to_pdf.generatePdf(file, options)
      pdfsBuffers.push(pdfBuffer)
      transaction = []
      break
    }
  }

  const Finalbuffer = await merge(pdfsBuffers)

  return Finalbuffer
}
