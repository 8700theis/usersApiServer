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

//Routes
app.use('/user', userRoute);

app.get('/', (req, res) => res.send('Du er på Home!'))

//Listen
app.listen(port, () => console.log(`Server running on port ${port} ...`));