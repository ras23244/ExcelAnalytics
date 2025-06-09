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

router.get('/profile', authMiddleware.authUser, userController.getProfile);

//profile route for admin

router.get('/admin-profile', authMiddleware.authUser, authMiddleware.authAdmin, userController.getAdminProfile);

router.post('/logout', authMiddleware.authUser, userController.logout);
 

// get the uploaded file
router.get('/my-uploads',authMiddleware.authUser,userController.getMyUploads)


// delete the uploaded file
router.delete('/delete-upload/:id', authMiddleware.authUser, userController.deleteUpload);
// Routes for admin

// List all users for admin
router.get(
    '/admin/allusers',
    authMiddleware.authUser,
    authMiddleware.authAdmin, // Ensure only admins can access
    userController.getAllUsers
);

//delete User
router.delete('/admin/:id',authMiddleware.authUser,authMiddleware.authAdmin,userController.deleteUser)


// list all uploaded files check this once 
router.get('/admin/allfiles',authMiddleware.authUser, authMiddleware.authAdmin,userController.getAllFiles)

// delete a particular file
router.delete('/admin/files/:id', authMiddleware.authUser, authMiddleware.authAdmin, userController.deleteFile);

// Get all users with their  uploaded files (for admin panel)
router.get(
    '/admin/users-with-files',
    authMiddleware.authUser,
    authMiddleware.authAdmin,
    userController.getUsersWithFiles
);

module.exports = router;