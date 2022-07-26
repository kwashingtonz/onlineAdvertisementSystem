//imports
const db = require('../models')
const { sequelize, Sequelize } = require('../models')
const jwt = require('jsonwebtoken')
require('dotenv').config()


//Getting main model
const Seller = db.sellers


//main work

 //check json web token exists & is verified
const verifyJWT = (req, res, next) => {
    const token = req.cookies.jwt  
   
    if(token){
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
            if(err){
                console.log(err.message)
                res.redirect('/login')
            }else{
                console.log(decodedToken)
                next()
            }
        })
    }else{
        res.redirect('/login')
    }
    
}

//check current user
const checkUser = (req,res,next) => {
    const token = req.cookies.jwt

    if(token){
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken) => {
            if(err){
                console.log(err.message)
                res.locals.user = null
                next()
            }else{
                console.log(decodedToken)
                let seller = await Seller.findAll({
                    attributes:{
                        exclude: 'sellerPassword'
                    },
                    where: {
                        sellerEmail : decodedToken.email
                    }
                })
                res.locals.user = seller
                next()
            }
        })
    }else{
        res.locals.user = null
        next()
    }
}


module.exports = { verifyJWT,checkUser }