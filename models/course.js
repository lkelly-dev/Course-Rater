// app/models/course.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CourseSchema = new Schema({
    name: String,
    instructors: Array,
    rating: Number,
    numberOfRatings: Number

});

module.exports = mongoose.model('Course', CourseSchema);
