import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const generateInvoice = (order, user) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];
      
      // Collect data into a buffer
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Invoice Header
      doc
        .fillColor('#4338ca') // Indigo-700
        .fontSize(28)
        .text('ShopNest', 50, 45)
        .fillColor('#4b5563')
        .fontSize(10)
        .text('123 Premium Street', 50, 75)
        .text('Coimbatore, Tamil Nadu 641001', 50, 90)
        .text('support@shopnest.com', 50, 105);

      // Invoice Meta Data
      doc
        .fillColor('#111827')
        .fontSize(20)
        .text('INVOICE', 50, 160)
        .fontSize(10)
        .fillColor('#4b5563')
        .text(`Invoice No: ${order._id}`, 50, 190)
        .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 50, 205)
        .text(`Payment: ${order.paymentMethod}`, 50, 220);

      // Customer Details
      doc
        .fillColor('#111827')
        .fontSize(12)
        .text('Bill To:', 300, 160)
        .fillColor('#4b5563')
        .fontSize(10)
        .text(user.name, 300, 175)
        .text(user.email, 300, 190);

      // Address section with dynamic Y positioning to handle text wrapping
      doc.text(order.shippingAddress.address, 300, 205, { width: 250 });
      doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`, 300, doc.y);
      doc.text(order.shippingAddress.country, 300, doc.y);

      // Line Break
      doc
        .strokeColor('#e5e7eb')
        .lineWidth(1)
        .moveTo(50, 270)
        .lineTo(550, 270)
        .stroke();

      // Table Header
      const tableTop = 290;
      doc
        .fillColor('#111827')
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('Item', 50, tableTop)
        .text('Quantity', 280, tableTop, { width: 90, align: 'right' })
        .text('Price', 370, tableTop, { width: 90, align: 'right' })
        .text('Total', 470, tableTop, { width: 80, align: 'right' });

      doc
        .strokeColor('#e5e7eb')
        .lineWidth(1)
        .moveTo(50, tableTop + 20)
        .lineTo(550, tableTop + 20)
        .stroke();

      // Table Rows
      let yPosition = tableTop + 30;
      doc.font('Helvetica');
      
      order.products.forEach((item) => {
        const itemTitle = item.product?.title || 'Premium Product';
        const itemQuantity = item.quantity;
        const itemPrice = `Rs. ${item.price.toFixed(2)}`;
        const itemTotal = `Rs. ${(item.price * item.quantity).toFixed(2)}`;

        let textXOffset = 0;
        if (item.product?.image) {
          // Resolve local file path
          const imagePath = path.join(process.cwd(), item.product.image);
          if (fs.existsSync(imagePath)) {
            doc.image(imagePath, 50, yPosition - 5, { width: 30, height: 30 });
            textXOffset = 40;
          }
        }

        doc
          .fillColor('#4b5563')
          .fontSize(10)
          .text(itemTitle, 50 + textXOffset, yPosition, { width: 230 - textXOffset })
          .text(itemQuantity.toString(), 280, yPosition, { width: 90, align: 'right' })
          .text(itemPrice, 370, yPosition, { width: 90, align: 'right' })
          .text(itemTotal, 470, yPosition, { width: 80, align: 'right' });

        yPosition += 35; // Increased spacing to accommodate the image
      });

      // Total Section
      const totalPosition = yPosition + 30;
      doc
        .strokeColor('#e5e7eb')
        .lineWidth(1)
        .moveTo(50, totalPosition - 15)
        .lineTo(550, totalPosition - 15)
        .stroke();

      doc
        .fillColor('#111827')
        .font('Helvetica-Bold')
        .fontSize(12)
        .text('Total Amount:', 370, totalPosition, { width: 90, align: 'right' })
        .text(`Rs. ${order.totalPrice.toFixed(2)}`, 470, totalPosition, { width: 80, align: 'right' });

      // Footer
      doc
        .font('Helvetica')
        .fontSize(10)
        .fillColor('#6b7280')
        .text(
          'Thank you for your business. We hope you enjoy your purchase!',
          50,
          700,
          { align: 'center', width: 500 }
        );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

export default generateInvoice;
