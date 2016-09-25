// app/models/course.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BuildingSchema = new Schema({
    name: String,
    code: String,
    lat: Number,
    long: Number
});

module.exports = mongoose.model('Building', BuildingSchema);
