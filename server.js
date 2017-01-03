var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var morgan = require('morgan');
var config = require('./config/database');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var port = process.env.PORT || 8080; // set our port
mongoose.Promise = global.Promise;
mongoose.connect(config.database); // connect to our database


// configure app
app.use(morgan('dev')); // log requests to the console
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var router = express.Router();

router.use(function (req, res, next) {
    console.log('Something is happening.');
    next();
});

require('./app/routes.js')(router,config,jwt);

app.use('/api', router);

app.listen(port);
console.log('App listening on port ' + port);
