const express = require('express');
const morgan = require('morgan'); // this is third party middleware

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

app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});
// Usually we defined Global Middleware handlers before all Routes

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);// Parameters id or other one we also need to write them in url in Postman
// //app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// 3 ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
// This called  Mounting the Routes here we Mounting Routes
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
