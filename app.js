const express = require('express');
const morgan = require('morgan'); // this is third party middleware


const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1 SEVERAL MIDDLEWARE
//console.log(process.env.NODE_ENV);production mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json()); //Create middleware
app.use(express.static(`${__dirname}/public`));



// Usually we defined Global Middleware handlers before all Routes

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //console.log(req.headers);
  next();
});


// 3 ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
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
