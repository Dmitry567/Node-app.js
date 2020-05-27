const express = require('express');
const userController = require('./../controllers/userController');


const router = express.Router();



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