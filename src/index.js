
// call the packages we need
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const authMiddleware = require('./middleware/auth');
const dotenv = require('dotenv');
const app = express();
// configure app
app.use(morgan('dev')); // log requests to the console

// cors 설정
app.use(cors())
// body parser 설정
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(authMiddleware);

const port = process.env.PORT || 8080; // set our port

// create our router
const router = express.Router();

// env 설정 
let path = __dirname.replace('src', 'config');
if (!process.env.NODE_ENV) {
  dotenv.config({path: `${path}/local.env`});
  console.log(process.env.ID)
} else if (process.env.NODE_ENV == 'production') {
  dotenv.config({path: `${path}/real.env`});
  console.log(process.env.ID)
} else if (process.env.NODE_ENV == 'development') {
  dotenv.config({path: `${path}/local.env`});
  console.log(process.env.ID)
}

// middleware to use for all requests
router.use(async (req, res, next) => {
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
