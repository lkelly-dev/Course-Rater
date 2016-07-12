// server.js

// BASE SETUP
// =============================================================================
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost/library_database'); // connect to our database
console.log(mongoose.connection.readyState);
// call the packages we need
var express    = require('express');        // call express
var cors       = require('cors');
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var Course     = require('./models/course');
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here
// on routes that end in /courses
// ----------------------------------------------------
router.route('/courses')
        // get all the courses (accessed at GET http://localhost:8080/api/courses)
    .get(function(req, res) {
        Course.find(function(err, courses) {
            if (err)
                res.send(err);

                  res.json(courses);
                  });
          })
    // create a course (accessed at POST http://localhost:8080/api/courses)
    .post(function(req, res) {
        console.log(mongoose.connection.readyState);
        var course = new Course();      // create a new instance of the Course model
        course.name = req.body.name; //set the courses name
        course.instructors = req.body.instructors;  // set the courses instructors (comes from the request)
        course.rating = req.body.rating;
        course.numberOfRatings = req.body.numberOfRatings;
        // save the course and check for errors
        course.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Course added!' });
        });
    });
    // on routes that end in /courses/:course_id
// ----------------------------------------------------
router.route('/courses/:course_id')

    // get the course with that id (accessed at GET http://localhost:8080/api/courses/:course_id)
    .get(function(req, res) {
        Course.findById(req.params.course_id, function(err, course) {
            if (err)
                res.send(err);
            res.json(course);
        });
    })
    // update the course with this id (accessed at PUT http://localhost:8080/api/courses/:course_id)
    .put(function(req, res) {

        // use our course model to find the course we want
        Course.findById(req.params.course_id, function(err, course) {

            if (err)
                res.send(err);

            course.name = req.body.name;  // update the courses info
            course.instructors = req.body.instructors;
            course.rating = req.body.rating;
            course.numberOfRatings = req.body.numberOfRatings;

            // save the course
            course.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Course updated!' });
            });

        });
    })
    // delete the bear with this id (accessed at DELETE http://localhost:8080/api/bears/:bear_id)
    .delete(function(req, res) {
        Course.remove({
            _id: req.params.course_id
        }, function(err, course) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);