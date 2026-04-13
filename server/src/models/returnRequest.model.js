import mongoose from 'mongoose';

const returnRequestSchema = new mongoose.Schema({
  orderId:      { type: String, required: true, trim: true },
  email:        { type: String, required: true, lowercase: true, trim: true },
  type:         { type: String, enum: ['return', 'exchange'], required: true },
  reason:       { type: String, required: true },
  exchangeItem: { type: String, default: '' },
  message:      { type: String, default: '' },
  status: {
    type: String,
    enum: ['Pending', 'Under Review', 'Approved', 'Rejected', 'Completed'],
    default: 'Pending',
  },
  adminNote:    { type: String, default: '' },
  resolvedAt:   { type: Date, default: null },
}, { timestamps: true });

const ReturnRequest = mongoose.model('ReturnRequest', returnRequestSchema);

export default ReturnRequest;   