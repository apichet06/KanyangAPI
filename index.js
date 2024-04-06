const express = require('express')
const cors = require('cors')

const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const provinces = require('./routes/provincesRoutes')
const districts = require('./routes/districtsRoutes')
const subdistricts = require('./routes/subdistrictsRoutes')

app.use('/api/provincesAll', provinces)
app.use('/api/district/', districts)
app.use('/api/subdistrict/', subdistricts)


app.get('/', function (req, res) {
    res.send("Welcome to the API , Ganyang system");
})

const port = process.env.PORT || 3310;
app.listen(port, () => {
    console.log("Server Running on Port " + port);
});