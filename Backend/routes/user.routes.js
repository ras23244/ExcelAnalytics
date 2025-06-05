const express = require('express');
const router = express.Router();
const { body }= require('express-validator');
const authMiddleware = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controllers');

// User registration route
router.post('/register',[
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('role').optional().isIn(['user', 'admin']).withMessage('Role must be either user or admin'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], 
    userController.register
)

// User login route
router.post('/login', [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required')
], 
    userController.login
);

router.post('/logout', authMiddleware.authUser, userController.logout);
 

module.exports = router;