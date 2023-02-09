const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const osSchema = new Schema({
    name: { type: String },
    type: { type: String },
});

const deviceSchema = new Schema({
    name: { type: String },
    brand: { type: String },
    type: { type: String },
});


const userSchema = new Schema({
    ip: { type: String },
    iptype: { type: String },
    name: { type: String },
    type: { type: String },
    version: { type: String },
    os: osSchema,
    device: deviceSchema,
});

const fileSchema = new Schema({
    alias: { type: String, required: true },
    filename: { type: String, required: true },
    filepath: { type: String },
    filetype: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    duration: { type: String },
    user: userSchema,
});

module.exports = mongoose.model('File', fileSchema, 'files'); 