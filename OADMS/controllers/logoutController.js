//imports
const db = require('../models')
const { sequelize, Sequelize } = require('../models')


//create main Model
const Seller = db.sellers


//main work

//Handling Logout
const handleLogout= async (req,res) => {
    
    res.cookie('jwt','',{ maxAge: 1 })
    res.redirect('/')
}


//eexporting module
module.exports = {
    handleLogout
}