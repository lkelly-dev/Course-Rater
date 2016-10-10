// app/models/course.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CourseSchema = new Schema({
    name: String,
    instructors: Array,
    short_description: String,
    long_description: String,
    sections: Array

});

module.exports = mongoose.model('Course', CourseSchema);
