const express = require('express');

const cors = require('cors');

const app = express();

var corOption = {
    origin: 'https://localhost:3000'
}

//middleware

app.use(cors(corOption));

app.use(express.json());

app.use(express.urlencoded({extended: true}));


//routers

const router = require('./routes/categoryRouter.js');

app.use('/', router)

//port

const PORT = process.env.PORT || 3000 ;

//server

app.listen(PORT, () => {
    console.log(`server is running ${PORT}`);
});