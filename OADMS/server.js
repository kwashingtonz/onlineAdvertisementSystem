//imports
const express = require('express')
const cors = require('cors')
const app = express()
const cookieParser = require('cookie-parser')
const { verifyJWT,currentUser } = require('./middleware/verifyJWT') //put verifyJWT in the params of get where do you want to authorize


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
const listRouter =  require('./routes/listRouter.js')
const regRouter = require('./routes/registerRouter.js')
const loginRouter = require('./routes/loginRouter.js')
const logoutRouter = require('./routes/logoutRouter.js')
const accountRouter = require('./routes/accountRouter.js')


//sending seller data as response to every route
app.get('*', currentUser)

//index Page Loading with Categories
app.use('/', indexRouter)

//getting items list
app.use('/list', listRouter)

//seller registration
app.use('/register', regRouter)

//seller login
app.use('/login', loginRouter)

//seller account - seller listings, post ad, seller settings
app.use('/account', verifyJWT ,accountRouter)

//logout
app.use('/logout',logoutRouter)


//server
app.listen(PORT, () => {
    console.log(`server is running ${PORT}`)
});