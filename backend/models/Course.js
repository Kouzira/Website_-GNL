const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  instructor: { type: String, required: true },
  description: { type: String, required: true },
  thumbnail: { type: String },
  sections: [{ type: Schema.Types.ObjectId, ref: 'Section' }],
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
