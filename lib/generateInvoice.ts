import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { IOrder } from './models/order';

interface InvoiceData extends IOrder {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    type: 'rental' | 'sale';
    rentalDuration?: {
      startDate: Date;
      endDate: Date;
    };
  }>;
}

export const generateInvoice = async (data: InvoiceData): Promise<Blob> => {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(20);
  doc.text('Virasat', 105, 15, { align: 'center' });
  doc.setFontSize(12);
  doc.text('Invoice', 105, 25, { align: 'center' });
  
  // Add customer details
  doc.setFontSize(10);
  doc.text(`Customer Name: ${data.customerName}`, 15, 40);
  doc.text(`Phone: ${data.customerPhone}`, 15, 45);
  doc.text(`Address: ${data.customerAddress}`, 15, 50);
  doc.text(`Order Date: ${new Date().toLocaleDateString()}`, 15, 55);
  doc.text(`Order Type: ${data.orderType.toUpperCase()}`, 15, 60);
  
  // Add items table
  const tableData = data.items.map(item => [
    item.name,
    item.quantity,
    item.type,
    item.rentalDuration ? 
      `${new Date(item.rentalDuration.startDate).toLocaleDateString()} - ${new Date(item.rentalDuration.endDate).toLocaleDateString()}` : 
      'N/A',
    `₹${item.price.toFixed(2)}`,
    `₹${(item.price * item.quantity).toFixed(2)}`
  ]);
  
  doc.autoTable({
    startY: 70,
    head: [['Item', 'Qty', 'Type', 'Duration', 'Price', 'Total']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [51, 51, 51] },
    styles: { fontSize: 8 },
  });
  
  const finalY = (doc as any).lastAutoTable.finalY || 70;
  
  // Add summary
  doc.text(`Subtotal: ₹${data.subtotal.toFixed(2)}`, 140, finalY + 10);
  
  if (data.discount) {
    const discountText = data.discount.type === 'percentage' ? 
      `Discount (${data.discount.value}%): ₹${((data.subtotal * data.discount.value) / 100).toFixed(2)}` :
      `Discount: ₹${data.discount.value.toFixed(2)}`;
    doc.text(discountText, 140, finalY + 15);
  }
  
  if (data.deposit > 0) {
    doc.text(`Deposit: ₹${data.deposit.toFixed(2)}`, 140, finalY + 20);
  }
  
  if (data.damageCharges > 0) {
    doc.text(`Damage Charges: ₹${data.damageCharges.toFixed(2)}`, 140, finalY + 25);
  }
  
  doc.setFontSize(12);
  doc.text(`Total: ₹${data.total.toFixed(2)}`, 140, finalY + 35);
  
  // Add footer
  doc.setFontSize(8);
  doc.text('Thank you for your business!', 105, 280, { align: 'center' });
  doc.text('For any queries, please contact us.', 105, 285, { align: 'center' });
  
  return doc.output('blob');
}; 