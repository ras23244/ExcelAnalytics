const chartRecordModel = require('../models/chartRecord.model');
const excelDataModel = require('../models/excelData.model');
const { createCanvas } = require('canvas');

const fs = require('fs');
const path = require('path');

module.exports.createChartRecord = async (req, res) => {
    try {
        const { excelRecordId, chartType, xAxis, yAxis,zAxis, chartTitle } = req.body;

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
            zAxis: zAxis,
            chartTitle: chartTitle
        });
        await newChartRecord.save();

        // Populate excelRecordId for frontend context
        const populatedChart = await chartRecordModel.findById(newChartRecord._id)
            .populate('excelRecordId', 'fileName uploadedAt');

        res.status(201).json({
            message: "Chart record created successfully",
            chart: populatedChart
        });
    }
    catch (err) {
        console.error("Error creating chart record:", err);
        res.status(500).json({ error: "Server error while creating chart record" });
    }
}
module.exports.getChartRecords = async (req, res) => {
    try {
        const chartRecords = await chartRecordModel.find({ user: req.user._id })
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

module.exports.deleteChartRecord = async (req, res) => {
    try {
        const chartRecord = await chartRecordModel.findByIdAndDelete(req.params.id);
        
        if (!chartRecord) {
            return res.status(404).json({ message: "Chart record not found" });
        }
        
        res.status(200).json({ message: "Chart record deleted successfully" });
    } catch (err) {
        console.error("Error deleting chart record:", err);
        res.status(500).json({ error: "Server error while deleting chart record" });
    }
}

//wrote code for downloading as image/pdf
