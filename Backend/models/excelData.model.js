const mongoose = require('mongoose');

const excelDataSchema = new mongoose.Schema({
    data:{
        type: Array,
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    fileName: {
        type:String,

    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const excelDataModel = mongoose.model('excelData', excelDataSchema);
module.exports = excelDataModel;
