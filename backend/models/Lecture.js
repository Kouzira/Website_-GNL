const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lectureSchema = new Schema({
  title: { type: String, required: true },
  contentType: { type: String, enum: ['video', 'text'], required: true },
  content: { type: String, required: true },
  section: { type: Schema.Types.ObjectId, ref: 'Section', required: true },
  videoFile: { type: String }, 
  textFile: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Lecture', lectureSchema);
