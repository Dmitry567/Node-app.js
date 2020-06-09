const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.signup= catchAsync(async (req, res, next) => {
    //const newUser = await User.create(req.body)
    const newUser = await User.create({
        // With this code we can not be admin
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    // Login new User right of way when user was created
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });


    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});