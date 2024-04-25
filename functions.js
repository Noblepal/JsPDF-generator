const { fs } = require('fs')
const { default: jsPDF } = require('jspdf')

function generateInvoiceData(invoiceNumber) {
    const today = new Date()
    const formattedDate = today.toLocaleDateString('en-US')

    return {
        invoiceNumber,
        issueDate: formattedDate,
        cleaningPeriod: 'January 1st, 2024 - January 31st, 2024',
        clientName: 'John Doe',
        clientAddress: '123 Main Street, Anytown, CA 12345',
        clientEmailPhone: 'johndoe@email.com (123) 456-7890',
        items: [
            {
                description: 'Basic Cleaning Service',
                unitCost: '50.0',
                quantity: '1',
                amount: '50.0',
            },
            {
                description: 'Window Cleaning (add-on)',
                unitCost: '25.0',
                quantity: '1',
                amount: '25.0',
            },
        ],
        subTotal: '75.0',
        discount: '0.0', // Assuming no discount for this example
        taxRate: '8.25', // Adjust this value based on your tax rate
        tax: '1524.51', // Calculate tax based on subtotal and taxRate
        total: '7874.22',
    }
}

function generateInvoice(invoiceData) {
    const doc = new jsPDF()
    const companyInfo = {
        name: 'Cleaning Services',
        address: '2001 Street Name, City, State, Country, Zip Code',
        email: 'cleaningservices@email.com',
        website: 'cleaningservices123.com',
    }
    const margin = 20

    // Invoice title
    doc.setFontSize(20)
    doc.text('INVOICE', margin, margin + 20)

    // Invoice details
    doc.setFontSize(10)
    doc.text(`INVOICE# ${invoiceData.invoiceNumber}`, margin, margin + 40)
    doc.text(
        `DATE OF ISSUE ${invoiceData.issueDate}`,
        doc.internal.pageSize.getWidth() - margin - 50,
        margin + 40
    )
    doc.text(
        `CLEANING PERIOD INCLUDED ${invoiceData.cleaningPeriod}`,
        margin,
        margin + 50
    )

    // Client billing information
    doc.setFontSize(12)
    doc.text('BILL TO', margin, margin + 70)
    doc.setFontSize(10)
    doc.text(`${invoiceData.clientName}`, margin, margin + 80)
    doc.text(`${invoiceData.clientAddress}`, margin, margin + 90)
    // Assuming client email and phone are in the same field, separated by a comma
    doc.text(`${invoiceData.clientEmailPhone}`, margin, margin + 100)

    // Table Header
    const tableStartY = margin + 120
    doc.setFontSize(10)
    doc.text('DESCRIPTION', margin, tableStartY)
    doc.text('UNIT COST', margin + 60, tableStartY)
    doc.text('QTY', margin + 100, tableStartY)
    doc.text('AMOUNT', margin + 130, tableStartY)

    // Invoice items loop
    let tableY = tableStartY + 10
    for (const item of invoiceData.items) {
        doc.text(item.description, margin, tableY)
        doc.text(item.unitCost, margin + 60, tableY, {
            align: 'right',
        })
        doc.text(item.quantity, margin + 100, tableY, { align: 'right' })
        doc.text(item.amount, margin + 130, tableY, {
            align: 'right',
        })
        tableY += 10
    }

    // Subtotal
    doc.setFontSize(12)
    doc.text('SUBTOTAL', margin, tableY + 10)
    doc.text(`$${invoiceData.subTotal}`, margin + 130, tableY + 10, {
        align: 'right',
    })

    // Discount
    if (invoiceData.discount > 0) {
        tableY += 10
        doc.text('DISCOUNT', margin, tableY + 10)
        doc.text(`-$${invoiceData.discount}`, margin + 130, tableY + 10, {
            align: 'right',
        })
    }

    // Tax
    tableY += 10
    doc.text(`(TAX RATE)`, margin, tableY + 10)
    doc.text(`${invoiceData.taxRate}%`, margin + 60, tableY + 10, {
        align: 'right',
    })
    tableY += 10
    doc.text('TAX', margin, tableY + 10)
    doc.text(`$${invoiceData.tax}`, margin + 130, tableY + 10, {
        align: 'right',
    })

    // Total
    tableY += 10
    doc.setFontSize(14)
    doc.text('TOTAL', margin, tableY + 10)
    doc.setFontSize(12)
    doc.text(`$${invoiceData.total}`, margin + 130, tableY + 10, {
        align: 'right',
    })

    // Company Information
    tableY = doc.internal.pageSize.getHeight() - margin - 30
    doc.setFontSize(10)
    doc.text('COMPANY INFORMATION', margin, tableY)
    tableY += 10
    doc.text(`${companyInfo.name}`, margin, tableY)
    doc.text(`${companyInfo.address}`, margin, tableY + 10)
    // Assuming website and email are on the same line
    doc.text(
        `${companyInfo.website} | ${companyInfo.email}`,
        margin,
        tableY + 20
    )

    // Adding a bottom border
    const bottomLine = doc.internal.pageSize.getHeight() - margin + 10
    doc.setLineWidth(1)
    doc.line(
        margin,
        bottomLine,
        doc.internal.pageSize.getWidth() - margin,
        bottomLine
    )

    // Optional: Adding a footer with page number
    const pageCount = doc.internal.getNumberOfPages()
    if (pageCount > 1) {
        doc.setFontSize(10)
        const pageNumber = `Page ${doc.internal.getCurrentPageNumber()} of ${pageCount}`
        const pageNumberWidth = doc.getStringWidth(pageNumber)
        const pageNumberX =
            (doc.internal.pageSize.getWidth() - pageNumberWidth) / 2
        doc.text(pageNumber, pageNumberX, bottomLine - 10)
    }

    return doc
}

module.exports = {
    generateInvoiceData,
    generateInvoice,
}
