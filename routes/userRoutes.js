const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');



const router = express.Router();


router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// PROTECT ALL ROUTES AFTER THIS MIDDLEWARE
router.use(authController.protect);

router.patch(
    '/updateMyPassword',
    authController.updatePassword
);

router.get(
    '/me',
    userController.getMe,
    userController.getUser
);

router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

router.use(authController.restrictTo('admin'));


router
    .route('/')// her the root of app
    .get(userController.getAllUsers)
    .post(userController.createUser);

router
    .route('/:id')// her whole URL
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);


module.exports = router;