const express = require('express')
const { generateInvoiceData } = require('./functions')
const { generateInvoice } = require('./functions')
const app = express()

app.get('/invoice/:invoiceNumber', (req, res) => {
    // Generate invoice data based on invoiceNumber from request params
    const invoiceData = generateInvoiceData(req.params.invoiceNumber)

    // Generate the PDF document
    const doc = generateInvoice(invoiceData)

    // Convert the PDF document to a Buffer
    const pdfArrayBuffer = doc.output('arraybuffer')

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf')

    res.end(Buffer.from(pdfArrayBuffer), (err) => {
        if (err) {
            console.error('Error sending PDF:', err)
            // Handle errors appropriately
        } else {
            console.log('PDF sent successfully!')
        }
    })
})

app.listen(3000, () => console.log('Server listening on port 3000'))
