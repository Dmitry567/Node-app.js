const express = require('express');
const morgan = require('morgan'); // this is third party middleware
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');


const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

// 1 GLOBAL MIDDLEWARE
//console.log(process.env.NODE_ENV);production mode
// Set Security HTTP Headers
app.use(helmet());

// Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// It is Middleware function to limit API req-s
// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into rq.body
app.use(express.json({ limit: '10kb' })); //Create middleware

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());


// Dat sanitization against XSS
app.use(xss());

//Prevent parameter pollution
app.use(hpp({
  whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
   ]
}));

// Serving static files
app.use(express.static(`${__dirname}/public`));



// Usually we defined Global Middleware handlers before all Routes
// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //console.log(req.headers);
  next();
});


// 3 ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
// This called  Mounting the Routes here we Mounting Routes

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});


// ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);



module.exports = app;

// app.get('/', (req, res) => {
//     res
//         .status(200)
//         .json({ message:'Hello from the server side!', app: 'Natours'});
// });
//
// app.post('/', (req, res) => {
//     res.send('You can post to this endpoint...')
// })
// v1 it is version of the API
// Demonstration of the concept of the Middleware
// app.use((req, res, next) => {
//   console.log('Hello from the middleware');
//   next();
// });

//app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);// Parameters id or other one we also need to write them in url in Postman
// //app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);
// Error handler
// const err = new Error(`Can't find ${req.originalUrl} on this server!`);
// err.status = 'fail';
// err.statusCode = 404;
