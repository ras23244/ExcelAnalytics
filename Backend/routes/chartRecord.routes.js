const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth.middleware');
const chartRecordController = require('../controllers/chartRecord.controllers');
const ChartRecord = require('../models/chartRecord.model');

// Route to create a new chart record
router.post(
  '/create',
  authMiddleware.authUser,
  [
    body('excelRecordId').notEmpty().withMessage('Excel Record ID is required'),
    body('chartType').notEmpty().withMessage('Chart Type is required'),
    body('xAxis').notEmpty().withMessage('X Axis is required'),
    body('yAxis').notEmpty().withMessage('Y Axis is required'),
    body('chartTitle').notEmpty().withMessage('Chart Title is required'),
  ],
  chartRecordController.createChartRecord
);

// Route to get all chart records for the authenticated user
router.get(
  '/my-charts',
  authMiddleware.authUser,
  chartRecordController.getChartRecords
);

// Route to get a specific chart record by ID
router.get('/:id',authMiddleware.authUser,chartRecordController.getChartRecordById);

// Route to delete a specific chart record by ID
router.delete(
  '/delete/:id',
  authMiddleware.authUser,
  chartRecordController.deleteChartRecord
);

// Route to download a specific chart record by ID
// router.get('/download/:id',authMiddleware.authUser,chartRecordController.downloadChart);

module.exports = router;