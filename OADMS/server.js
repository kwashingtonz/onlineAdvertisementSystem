const express = require('express');

const cors = require('cors');

const app = express();

//port

const PORT = process.env.PORT || 3000 ;

var corOption = {
    origin: `https://localhost:${PORT}`
}

//middleware

app.use(cors(corOption));

app.use(express.json());

app.use(express.urlencoded({extended: true}));


//routers

const router = require('./routes/categoryRouter.js');
app.use('/home', router)


//server

app.listen(PORT, () => {
    console.log(`server is running ${PORT}`);
});