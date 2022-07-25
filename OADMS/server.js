//imports
const express = require('express')

const cors = require('cors')

const app = express()


//port
const PORT = process.env.PORT || 3000 

var corOption = {
    origin: `https://localhost:${PORT}`
}


//middleware
app.use(cors(corOption))

app.use(express.json())

app.use(express.urlencoded({extended: true}))


//routers
const indexRouter = require('./routes/indexRouter.js')
const itemRouter =  require('./routes/itemRouter.js')
const regRouter = require('./routes/registerRouter.js')
const loginRouter = require('./routes/loginRouter.js')

//index Page Loading with Categories
app.use('/', indexRouter)

//getting items list
app.use('/items', itemRouter)

//seller registration
app.use('/register', regRouter)

//seller login
app.use('/login', loginRouter)


//server
app.listen(PORT, () => {
    console.log(`server is running ${PORT}`)
});