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

const indexRouter = require('./routes/indexRouter.js');

app.use('/', indexRouter)

app.get('/items',(req,res) => {
    let searchI = req.query.search
    res.send(searchI)
})

app.post('/search',(req,res) =>{
    let searchName = req.body.searchName
    res.redirect('/items?search='+searchName);
});

//server

app.listen(PORT, () => {
    console.log(`server is running ${PORT}`);
});