import ReturnRequest from '../models/returnRequest.model.js';

// ── USER: Submit a return/exchange request ──
export const submitRequest = async (req, res) => {
  try {
    const { orderId, email, type, reason, exchangeItem, message } = req.body;

    if (!orderId || !email || !type || !reason)
      return res.status(400).json({ success: false, message: 'orderId, email, type, and reason are required.' });

    if (type === 'exchange' && !exchangeItem?.trim())
      return res.status(400).json({ success: false, message: 'exchangeItem is required for exchange requests.' });

    // Prevent duplicate pending request for same order
    const existing = await ReturnRequest.findOne({ orderId: orderId.trim(), status: { $in: ['Pending', 'Under Review'] } });
    if (existing)
      return res.status(409).json({ success: false, message: 'A request for this order is already under review.' });

    const request = await ReturnRequest.create({
      orderId: orderId.trim(),
      email: email.trim().toLowerCase(),
      type,
      reason,
      exchangeItem: exchangeItem?.trim() || '',
      message: message?.trim() || '',
    });

    res.status(201).json({
      success: true,
      message: 'Your request has been submitted. We will respond within 24 hours.',
      requestId: request._id,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── USER: Track request by orderId + email ──
export const trackRequest = async (req, res) => {
  try {
    const { orderId, email } = req.query;
    if (!orderId || !email)
      return res.status(400).json({ success: false, message: 'orderId and email are required.' });

    const request = await ReturnRequest.findOne({
      orderId: orderId.trim(),
      email: email.trim().toLowerCase(),
    }).sort({ createdAt: -1 });

    if (!request)
      return res.status(404).json({ success: false, message: 'No request found for this order and email.' });

    res.json({ success: true, request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── ADMIN: Get all requests with filters + pagination ──
export const getAllRequests = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type, search } = req.query;

    const query = {};
    if (status) query.status = status;
    if (type)   query.type   = type;
    if (search) query.$or = [
      { orderId: { $regex: search, $options: 'i' } },
      { email:   { $regex: search, $options: 'i' } },
    ];

    const requests = await ReturnRequest.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await ReturnRequest.countDocuments(query);

    res.json({ success: true, requests, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── ADMIN: Get single request ──
export const getRequestById = async (req, res) => {
  try {
    const request = await ReturnRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });
    res.json({ success: true, request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── ADMIN: Update status + optional admin note ──
export const updateRequestStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const allowed = ['Pending', 'Under Review', 'Approved', 'Rejected', 'Completed'];
    if (!allowed.includes(status))
      return res.status(400).json({ success: false, message: `Status must be one of: ${allowed.join(', ')}` });

    const update = { status };
    if (adminNote !== undefined) update.adminNote = adminNote;
    if (['Approved', 'Rejected', 'Completed'].includes(status)) update.resolvedAt = new Date();

    const request = await ReturnRequest.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });

    res.json({ success: true, message: `Request marked as ${status}.`, request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── ADMIN: Delete request ──
export const deleteRequest = async (req, res) => {
  try {
    const request = await ReturnRequest.findByIdAndDelete(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });
    res.json({ success: true, message: 'Request deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── ADMIN: Stats summary ──
export const getRequestStats = async (req, res) => {
  try {
    const [total, pending, approved, rejected, completed, returns, exchanges] = await Promise.all([
      ReturnRequest.countDocuments(),
      ReturnRequest.countDocuments({ status: 'Pending' }),
      ReturnRequest.countDocuments({ status: 'Approved' }),
      ReturnRequest.countDocuments({ status: 'Rejected' }),
      ReturnRequest.countDocuments({ status: 'Completed' }),
      ReturnRequest.countDocuments({ type: 'return' }),
      ReturnRequest.countDocuments({ type: 'exchange' }),
    ]);
    res.json({ success: true, stats: { total, pending, approved, rejected, completed, returns, exchanges } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};