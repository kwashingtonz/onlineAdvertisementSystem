//imports
const db = require('../models')
const { sequelize, Sequelize } = require('../models')
const bcrypt = require('bcrypt')

//create main Model
const Seller = db.seller

//main work

//get All Cities
const getAllSellers = async (req,res) => {

    const data =  await City.findAll({
        attributes: {
            exclude:[
                'createdAt',
                'updatedAt'
            ]
        }
    })
    res.status(200).send(data)
}


//register new seller
const addNewSeller = async (req,res) => {
    const {sellerId,sellerName,sellerEmail,sellerPassword,sellerCity,sellerContact} = req.body

    //checking all data is available
    if(!sellerId || !sellerName || !sellerEmail || !sellerPassword || !sellerCity || !sellerContact)
        return res.status(400).json({'message': 'All information are required'})

    

}

module.exports = {
    getAllSellers,
    addNewSeller
}