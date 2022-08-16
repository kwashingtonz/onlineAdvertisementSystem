//imports
const db = require('../models')
const { sequelize, Sequelize } = require('../models')
//const jwt = require('jsonwebtoken')
//const jwtblack = require('jwt-blacklist')(jwt)

//create main Model
const Seller = db.sellers


//main work

//Handling Logout
const handleLogout= async (req,res) => {
    
    const token = req.cookies.jwt
    res.cookie('jwt','',{ maxAge: 1 })
    
    //jwtblack.blacklist(token)
    res.status(200).send({message: 'Logged Out'})
    //res.redirect('/')
}


//eexporting module
module.exports = {
    handleLogout
}