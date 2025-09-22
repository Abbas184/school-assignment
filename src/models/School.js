import mongoose from 'mongoose';

const SchoolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  contact: { type: String, required: true },
  image: { type: String, required: true },
  email_id: { type: String, required: true },
});

export default mongoose.models.School || mongoose.model('School', SchoolSchema);