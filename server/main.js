// call the packages we need
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const morgan = require('morgan');
const cors = require('cors');

// configure app
app.use(morgan('dev')); // log requests to the console

// cors 설정
app.use(cors())
// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8080; // set our port

// create our router
const router = express.Router();

// middleware to use for all requests
router.use(function (req, res, next) {
  // do logging
  console.log('Something is happening.');
  next();
});

require('./routes/routes')(router);

// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);
// START THE SERVER
// =============================================================================
app.listen(port);
console.log(`Magic happens on port ${port}`);
