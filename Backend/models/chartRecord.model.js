const mongoose = require('mongoose');

const ChartRecordSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  excelRecordId: { type: mongoose.Schema.Types.ObjectId, ref: 'excelData' },
  chartType: String,
  xAxis: String,
  yAxis: String,
  chartTitle: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChartRecord', ChartRecordSchema);

