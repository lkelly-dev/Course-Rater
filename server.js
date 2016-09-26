// server.js

// BASE SETUP
// =============================================================================
var mongoose = require('mongoose');
mongoose.connect('mongodb://liam123:liam123@ds031571.mlab.com:31571/courserater'); // connect to our database


//mongodb://localhost/library_database
console.log(mongoose.connection.readyState);
// call the packages we need
var express = require('express'); // call express
var cors = require('cors');
var app = express(); // define our app using express
var bodyParser = require('body-parser');
var Course = require('./models/course');
var Rating = require('./models/rating');
var Building = require('./models/building');


var port = process.env.PORT || 8080;
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var configDB = require('./public/config/database.js');


 require('./public/config/passport')(passport); // pass passport for configuration


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors());


app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'ilovescotchscotchyscotchscotch'
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public/');


app.use(function (req, res, next) {
  res.locals.login = req.isAuthenticated();
  next();
});


var port = process.env.PORT || 8080; // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({
        message: 'hooray! welcome to our api!'
    });
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
        var course = new Course(); // create a new instance of the Course model
        course.name = req.body.name; //set the courses name
        course.instructors = req.body.instructors; // set the courses instructors (comes from the request)
        course.rating = req.body.rating;
        course.numberOfRatings = req.body.numberOfRatings;
        course.sections = req.body.sections;
        // save the course and check for errors
        course.save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message: 'Course added!'
            });
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

            course.name = req.body.name; // update the courses info
            course.instructors = req.body.instructors;
            course.rating = req.body.rating;
            course.numberOfRatings = req.body.numberOfRatings;
            course.sections = req.body.sections;

            // save the course
            course.save(function(err) {
                if (err)
                    res.send(err);

                res.json({
                    message: 'Course updated!'
                });
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

            res.json({
                message: 'Successfully deleted'
            });
        });
    });



//SEPARATE


    // more routes for our API will happen here
    // on routes that end in /rating
    // ----------------------------------------------------
    router.route('/ratings')
        // get all the ratings (accessed at GET http://localhost:8080/api/ratings)
        .get(function(req, res) {
            Rating.find(function(err, ratings) {
                if (err)
                    res.send(err);

                res.json(ratings);
            });
        })
        // create a course (accessed at POST http://localhost:8080/api/ratings)
        .post(function(req, res) {
            console.log(mongoose.connection.readyState);
            var rating = new Rating();
            rating.rating_value = req.body.rating_value;
            rating.userID = req.body.userID;
            rating.courseID = req.body.courseID;
            // save the course and check for errors
            rating.save(function(err) {
                if (err)
                    res.send(err);

                res.json({
                    message: 'Rating added!'
                });
            });
        });
    // on routes that end in /courses/:course_id
    // ----------------------------------------------------
    router.route('/ratings/:rating_id')

    // get the rating with that id (accessed at GET http://localhost:8080/api/courses/:rating_id)
    .get(function(req, res) {
            Rating.findById(req.params.rating_id, function(err, rating) {
                if (err)
                    res.send(err);
                res.json(rating);
            });
        })
        // update the rating with this id (accessed at PUT http://localhost:8080/api/courses/:course_id)
        .put(function(req, res) {

            // use our course model to find the course we want
            Rating.findById(req.params.rating_id, function(err, rating) {

                if (err)
                    res.send(err);

                    rating.rating_value = req.body.rating_value;
                    rating.userID = req.body.userID;
                    rating.courseID = req.body.courseID;

                // save the course
                rating.save(function(err) {
                    if (err)
                        res.send(err);

                    res.json({
                        message: 'Rating updated!'
                    });
                });

            });
        })
        // delete the bear with this id (accessed at DELETE http://localhost:8080/api/bears/:bear_id)
        .delete(function(req, res) {
            Rating.remove({
                _id: req.params.rating_id
            }, function(err, rating) {
                if (err)
                    res.send(err);

                res.json({
                    message: 'Successfully deleted'
                });
            });
        });




//SEPARATE



// more routes for our API will happen here
// on routes that end in /rating
// ----------------------------------------------------
router.route('/buildings')
    // get all the ratings (accessed at GET http://localhost:8080/api/ratings)
    .get(function(req, res) {
        Building.find(function(err, buildings) {
            if (err)
                res.send(err);

            res.json(buildings);
        });
    })
    // create a course (accessed at POST http://localhost:8080/api/ratings)
    .post(function(req, res) {
        console.log(mongoose.connection.readyState);
        var building = new Building();
        building.name = req.body.name;
        building.code = req.body.code;
        building.lat = req.body.lat;
        building.long = req.body.long;
        // save the course and check for errors
        building.save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message: 'Building added!'
            });
        });
    });
// on routes that end in /courses/:course_id
// ----------------------------------------------------
router.route('/buildings/:building_id')

// get the rating with that id (accessed at GET http://localhost:8080/api/courses/:rating_id)
.get(function(req, res) {
        Building.findById(req.params.building_id, function(err, building) {
            if (err)
                res.send(err);
            res.json(building);
        });
    })
    // update the rating with this id (accessed at PUT http://localhost:8080/api/courses/:course_id)
    .put(function(req, res) {

        // use our course model to find the course we want
        Building.findById(req.params.building_id, function(err, building) {

            if (err)
                res.send(err);

                building.name = req.body.name;
                building.code = req.body.code;
                building.lat = req.body.lat;
                building.long = req.body.long;

            // save the course
            building.save(function(err) {
                if (err)
                    res.send(err);

                res.json({
                    message: 'Building updated!'
                });
            });

        });
    })
    // delete the bear with this id (accessed at DELETE http://localhost:8080/api/bears/:bear_id)
    .delete(function(req, res) {
        Building.remove({
            _id: req.params.building_id
        }, function(err, building) {
            if (err)
                res.send(err);

            res.json({
                message: 'Successfully deleted'
            });
        });
    });









//SEPARATE




// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

require('./public/app/routes.js')(app, passport);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
