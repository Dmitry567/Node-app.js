const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');


exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
}

// Creating Documents by using Mongoose
exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
     const stats = await Tour.aggregate([
       {
         $match: { ratingsAverage: { $gte: 4.5 }}
       },
       {
         $group: {
           //_id: '$ratingsAverage',
           _id: { $toUpper: '$difficulty'},
           numTours: { $sum: 1},
           numRatings: { $sum: '$ratingsQuantity'},
           avgRating: { $avg: '$ratingsAverage'},
           avgPrice: { $avg: '$price'},
           minPrice: { $min: '$price'},
           maxPrice: { $max: '$price'}
         }
       },
       {
         $sort: { avgPrice: 1}
       },
       // {
       //   $match: { _id: { $ne: 'EASY'}}
       // }
     ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats
      },
    });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
     const year = req.params.year * 1;// 2021

     const plan = await Tour.aggregate([
       {
         $unwind: '$startDates'
       },
       {
         $match: {
           startDates: {
             $gte: new Date(`${year}-01-01`),
             $lte: new Date(`${year}-12-31`),
           }
         }
       },
       {
         $group: {
           _id: { $month: '$startDates'},
           numTourStarts: { $sum: 1},
           tours: { $push: '$name'}
         }
       },
       {
         $addFields: { month: '$_id' }
       },
       {
         $project: {
           _id: 0
         }
       },
       {
         $sort: { numTourStarts: -1}
       },
       {
         $limit: 12
       }
     ]);

    res.status(200).json({
      status: 'success',
      data: {
        plan
      }
    });
});

// //tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/233/center/-40,45/unit/mi this is how we specify URL

exports.getToursWithin = catchAsync(async (req, res, next) => {
   const { distance, latlng, unit } = req.params;
   const [lat, lng] = latlng.split(',');

   const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

   if(!lat || !lng) {
     next(
         new AppError(
         'Please provide latitude and longitude in the formant lat, lng.',
         400
     )
     );
   }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

   res.status(200).json({
     status: 'success',
     results: tours.length,
     data: {
       data: tours
     }
   });
});
// By doing aggregate we can do manipulation of data different ways
//const fs = require('fs');

// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

// This Middleware part of pipeline

// exports.checkID = (req, res, next, val) => {
//     console.log(`Tour id is: ${val}`);

//     if(req.params.id * 1 > tours.length){
//         return res.status(404).json({
//             status: 'fail',
//             message: 'Invalid ID'
//         });
//     }
//     next();
// }

// exports.checkBody = (req, res, next) => {
//     if (!req.body.name || !req.body.price) {
//       return res.status(400).json({
//         status: 'fail',
//         message: 'Missing name or price',
//       });
//     }
//     next();
//   };

// Get Tour code

// console.log(req.params); //{ id: '5' }
// const id = req.params.id * 1;

// const tour = tours.find(el => el.id === id)

// try {
//   // const newTour = new Tour({})
//   // newTour.save()
//
// } catch (err) {
//   res.status(400).json({
//     status: 'fail',
//     message: err,
//   });
// }





