const { prisma } = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

const calculateTotal = (items = []) =>
  items.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.price || 0), 0);

const createInvoice = async (req, res) => {
  try {
    const { invoiceNumber, clientName, items = [], status = 'unpaid', date = new Date() } = req.body;

    if (!invoiceNumber || !clientName) {
      return errorResponse(res, 'Invoice number and client name are required', 400);
    }

    const totalAmount = calculateTotal(items);

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        clientName,
        totalAmount,
        status,
        date: date ? new Date(date) : new Date(),
        userId: req.user.id,
        items: {
          create: items.map((item) => ({
            name: item.name,
            quantity: Number(item.quantity) || 0,
            price: Number(item.price) || 0,
          })),
        },
      },
      include: { items: true },
    });

    return successResponse(res, { invoice }, 'Invoice created', 201);
  } catch (error) {
    console.error('Create invoice error:', error.message);
    return errorResponse(res, 'Unable to create invoice');
  }
};

const getInvoices = async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      where: { userId: req.user.id },
      orderBy: { date: 'desc' },
      include: { items: true },
    });
    return successResponse(res, { invoices });
  } catch (error) {
    console.error('Get invoices error:', error.message);
    return errorResponse(res, 'Unable to fetch invoices');
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const invoice = await prisma.invoice.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: { items: true },
    });

    if (!invoice) {
      return errorResponse(res, 'Invoice not found', 404);
    }

    return successResponse(res, { invoice });
  } catch (error) {
    console.error('Get invoice error:', error.message);
    return errorResponse(res, 'Unable to fetch invoice');
  }
};

const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { items, status, clientName, invoiceNumber, date } = req.body;

    const existing = await prisma.invoice.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!existing) {
      return errorResponse(res, 'Invoice not found', 404);
    }

    const data = {};

    if (typeof status !== 'undefined') data.status = status;
    if (typeof clientName !== 'undefined') data.clientName = clientName;
    if (typeof invoiceNumber !== 'undefined') data.invoiceNumber = invoiceNumber;
    if (typeof date !== 'undefined') data.date = new Date(date);

    let totalAmount = existing.totalAmount;

    const updatedInvoice = await prisma.$transaction(async (tx) => {
      if (Array.isArray(items)) {
        await tx.invoiceItem.deleteMany({ where: { invoiceId: id } });
        totalAmount = calculateTotal(items);
        data.items = {
          create: items.map((item) => ({
            name: item.name,
            quantity: Number(item.quantity) || 0,
            price: Number(item.price) || 0,
          })),
        };
        data.totalAmount = totalAmount;
      }

      return tx.invoice.update({
        where: { id },
        data,
        include: { items: true },
      });
    });

    return successResponse(res, { invoice: updatedInvoice }, 'Invoice updated');
  } catch (error) {
    console.error('Update invoice error:', error.message);
    return errorResponse(res, 'Unable to update invoice');
  }
};

const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await prisma.invoice.findFirst({
      where: { id, userId: req.user.id },
    });

    if (!invoice) {
      return errorResponse(res, 'Invoice not found', 404);
    }

    await prisma.invoice.delete({ where: { id } });

    return successResponse(res, { id }, 'Invoice deleted');
  } catch (error) {
    console.error('Delete invoice error:', error.message);
    return errorResponse(res, 'Unable to delete invoice');
  }
};

module.exports = {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
};
