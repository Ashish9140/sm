const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const fileSchema = new Schema({
    alias: { type: String, required: true },
    filename: { type: String, required: true },
    filepath: { type: String, required: true },
    filetype: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    duration: { type: String },
});

module.exports = mongoose.model('File', fileSchema, 'files'); 