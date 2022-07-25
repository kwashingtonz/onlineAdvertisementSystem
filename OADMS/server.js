//imports
const express = require('express')

const cors = require('cors')

const app = express()

const corOption = require('./config/corOptions')

const verifyJWT = require('./middleware/verifyJWT')

const cookieParser = require('cookie-parser')

const credentials = require('./middleware/credentials')


//port
const PORT = process.env.PORT || 3000 


//middleware

app.use(credentials)

//cross origin resource sharing
app.use(cors(corOption))

//built in middleware for json
app.use(express.json())

//built in middleware to handle urlencoded form data
app.use(express.urlencoded({extended: true}))

//middleware for cookie-parser
app.use(cookieParser())


//routers
const indexRouter = require('./routes/indexRouter.js')
const itemRouter =  require('./routes/itemRouter.js')
const regRouter = require('./routes/registerRouter.js')
const loginRouter = require('./routes/loginRouter.js')
const refreshTokenRouter = require('./routes/refreshTokenRouter.js')
const logoutRouter = require('./routes/logoutRouter.js')

//index Page Loading with Categories
app.use('/', indexRouter)

//seller registration
app.use('/register', regRouter)

//seller login
app.use('/login', loginRouter)

//getting items list
app.use('/items', itemRouter)

/* 
//refresh access token
app.use('/refresh', refreshTokenRouter)
//logout
app.use('/logout',logoutRouter)
//verify access token
app.use(verifyJWT) */
//put routers after above line to veryify the jwt


//server
app.listen(PORT, () => {
    console.log(`server is running ${PORT}`)
});