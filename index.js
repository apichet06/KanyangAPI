const express = require('express')
const cors = require('cors')

const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', function (req, res) {
    res.send("Welcome to the API , Goods Shop ");
})

const port = process.env.PORT || 3310;
app.listen(port, () => {
    console.log("Server Running on Port " + port);
});