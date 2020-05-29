const Tour = require('./../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query)
    // BUILD QUERY
    // 1A) Filtering
    const queryObj = {...req.query};
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el])

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);// Regular Expression

    // { difficulty: 'easy', duration: { $gte: 5} } $ it is MongoDB operator sing
    // { difficulty: 'easy', duration: { gte: '5' } }
    // gte- greater than or equal, gt-greater than, lte-less than or equal, lt-less than

    let query = Tour.find(JSON.parse(queryStr));

    // 2) Sorting
    if(req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
     query = query.sort('-createdAt');
    }

    // 3) Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields)
    } else {
      query = query.select('-__v');
    }

    // 4) Pagination
     const page = req.query.page * 1 || 1;
     const limit = req.query.limit * 1 || 100;
     const skip = (page - 1) * limit;


    // page=2&limit=10, 1-10, page 1, 11-20, page 2, 21-30 page 3
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page does not exist');
    }


    // EXECUTE THE QUERY
    const tours = await query;
    // query.sort().select().skip().limit()

    // find() method returns the query this is the reason why we can not use chaining here
    // const tours = Tour.find()
    //     .where('duration')
    //     .equals(5)
    //     .where('difficulty')
    //     .equals('easy')

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({ _id: req.params.id})

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

// Creating Documents by using Mongoose
exports.createTour = async (req, res) => {
  try {
    // const newTour = new Tour({})
    // newTour.save()

    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
// console.log(req.body);

//     const newId = tours[tours.length -1].id + 1;// Create id usually DataBase creating id autom-y
//     const newTour = Object.assign({id: newId}, req.body);

//     tours.push(newTour);

//     fs.writeFile(
//         `${__dirname}/dev-data/data/tours-simple.json`,
//         JSON.stringify(tours),
//         err => {

//             })
//         })
// }

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

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
