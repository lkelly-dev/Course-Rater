// app/models/rating.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CourselistSchema = new Schema({
    user: String,
    list: Array

});

module.exports = mongoose.model('Courselist', CourselistSchema);
