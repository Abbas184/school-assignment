import mongoose from 'mongoose';

const SchoolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  contact: { type: String, required: true },
  image: { type: String, required: true },
  email_id: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 5, default: 0 },
  googleMapsLink: { type: String, required: true }, // <-- ADDED THIS LINE
});

export default mongoose.models.School || mongoose.model('School', SchoolSchema);