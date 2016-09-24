// app/models/rating.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RatingSchema = new Schema({
    rating_value: Number,
    userID: String,
    courseID: String

});

module.exports = mongoose.model('Rating', RatingSchema);
