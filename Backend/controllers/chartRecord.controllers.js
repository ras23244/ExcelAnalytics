const chartRecordModel = require('../models/chartRecord.model');
const excelDataModel = require('../models/excelData.model');
const { createCanvas } = require('canvas');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

module.exports.createChartRecord = async (req, res) => {
    try {
        const { excelRecordId, chartType, xAxis, yAxis, chartTitle } = req.body;
    
        // Validate if the Excel record exists
        const excelRecord = await excelDataModel.findById(excelRecordId);
        if (!excelRecord) {
            return res.status(404).json({ message: "Excel record not found" });
        }
        // Create a new chart record
        const newChartRecord = new chartRecordModel({
            user: req.user._id,
            excelRecordId: excelRecordId,
            chartType: chartType,
            xAxis: xAxis,
            yAxis: yAxis,
            chartTitle: chartTitle
        });
        await newChartRecord.save();
        res.status(201).json({
            message: "Chart record created successfully",
            chartRecord: newChartRecord
        });
    }
    catch (err) {
        console.error("Error creating chart record:", err);
        res.status(500).json({ error: "Server error while creating chart record" });
    }
}
module.exports.getChartRecords = async (req, res) => {
    try {
        const chartRecords = await chartRecordModel.find({ user: req.user.id })
            .populate('excelRecordId', 'fileName uploadedAt')
            .sort({ createdAt: -1 });
        
        res.status(200).json(chartRecords);
    } catch (err) {
        console.error("Error fetching chart records:", err);
        res.status(500).json({ error: "Server error while fetching chart records" });
    }
}

module.exports.getChartRecordById = async (req, res) => {
    try {
        const chartRecord = await chartRecordModel.findById(req.params.id)
            .populate('excelRecordId', 'fileName uploadedAt');
        
        if (!chartRecord) {
            return res.status(404).json({ message: "Chart record not found" });
        }
        
        res.status(200).json(chartRecord);
    } catch (err) {
        console.error("Error fetching chart record:", err);
        res.status(500).json({ error: "Server error while fetching chart record" });
    }
}

//wrote code for downloading as image/pdf