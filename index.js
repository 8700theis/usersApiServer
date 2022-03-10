const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./DB/connection');

//Routes Import
const userRoute = require('./routes/userRoute');

const port = process.env.PORT || 3000;

//Connect to Database
connectDB();

//Middleweares
app.use(cors());
app.use(express.json({ extended: false }));
// Express server middleware
app.use('/uploads', express.static('uploads'));
app.use(express.static('src'));

//Routes
app.use('/user', userRoute);

app.get('/', (req, res) => {
    res.sendFile('src/htmlFiles/index.html', { root: __dirname });
});

//Listen
app.listen(port, () => console.log(`Server running on port ${port} ...`));