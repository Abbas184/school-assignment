import mongoose from 'mongoose';

const SchoolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  contact: { type: String, required: true },
  image: { type: String, required: true },
  email_id: { type: String, required: true },
  // --- THIS IS THE FIX ---
  // We now provide a 'default' value. If a rating isn't given,
  // it will automatically be set to 0. This prevents 'undefined'.
  rating: { type: Number, required: true, min: 0, max: 5, default: 0 },
  // --- END OF FIX ---
});

export default mongoose.models.School || mongoose.model('School', SchoolSchema);