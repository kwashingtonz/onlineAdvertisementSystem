//imports
const express = require('express')
const cors = require('cors')
const app = express()
const cookieParser = require('cookie-parser')
const { checkUser } = require('./middleware/verifyJWT')


//port
const PORT = process.env.PORT || 3000 


//setting up cors options
var corOption = {
    origin: `https://localhost:${PORT}`
}


//middleware

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
const logoutRouter = require('./routes/logoutRouter.js')


//sending seller data as response to every route
app.get('*', checkUser)

//index Page Loading with Categories
app.use('/', indexRouter)

//seller registration
app.use('/register', regRouter)

//seller login
app.use('/login', loginRouter)

//getting items list
app.use('/items', itemRouter)

//logout
app.use('/logout',logoutRouter)


//server
app.listen(PORT, () => {
    console.log(`server is running ${PORT}`)
});