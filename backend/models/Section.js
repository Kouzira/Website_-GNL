const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sectionSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  lectures: [{ type: Schema.Types.ObjectId, ref: 'Lecture' }],
}, { timestamps: true });

module.exports = mongoose.model('Section', sectionSchema);
