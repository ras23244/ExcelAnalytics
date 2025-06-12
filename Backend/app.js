const express = require('express');
const app= express();
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
dotenv.config();
const connectToDb = require('./db/db');
const userRoutes = require('./routes/user.routes');
const excelDataRoutes = require('./routes/excelData.routes');
const chartRecordRoutes = require('./routes/chartRecord.routes');
const insightsRoutes = require('./routes/insights.routes');
connectToDb();

app.use(cookieParser());
// Fix CORS to allow credentials and set allowed origin
app.use(cors({
  origin: 'https://excelanalytics-frontend.onrender.com',
  credentials: true
}));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/user',userRoutes);
app.use('/data', excelDataRoutes);
app.use('/chart', chartRecordRoutes);
app.use('/api', insightsRoutes);

module.exports= app;
