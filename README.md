# PDF Generator using JsPDF library

A simple node app that can be used to generate PDF documents. Use case of an invoice.

### Usage

##### Install dependencies

```bash
yarn
```

##### Run server

```bash
yarn dev
```

##### Running with `curl`

```bash
curl -o invoice.pdf http://localhost:3000/invoice/101
```

##### Running with `fetch`

```js
async function downloadInvoicePDF(invoiceNumber) {
    try {
        const response = await fetch(`/invoice/${invoiceNumber}`)
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'invoice.pdf'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
    } catch (error) {
        console.error('Error downloading invoice:', error)
    }
}

downloadInvoicePDF('101')
```

##### Output

A PDF file called `invoice.pdf` will be downloaded to your machine.
