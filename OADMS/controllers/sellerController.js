//imports
const db = require('../models')
const { sequelize, Sequelize } = require('../models')
const bcrypt = require('bcrypt')

//create main Model
const Seller = db.sellers


//main work

//get All Sellers
const getAllSellers = async (req,res) => {

    const seller =  await Seller.findAll({
        attributes: {
            exclude:[
                'createdAt',
                'updatedAt'
            ]
        }
    })

    res.status(200).send({
        sellers : seller
    })
}


//register new seller
const addNewSeller = async (req,res) => {
    const {sellerId,sellerName,sellerEmail,sellerPassword,sellerCity,sellerContact} = req.body

    //checking all data is available
    if(!sellerId || !sellerName || !sellerEmail || !sellerPassword || !sellerCity || !sellerContact)
        return res.status(400).json({'message': 'All information are required'})

    //check for dupicate sellers
    const duplicate = await Seller.findAll({
        attributes: {
            exclude:[
                'createdAt',
                'updatedAt'
            ]
        },
        where: {
            sellerEmail : sellerEmail
        }
    })

    if(duplicate) return res.sendStatus(409);//Conflict
    try{
        //encrypt the password
        const hashedPwd = await bcrypt.hash(sellerPassword, 10)

        //store the new seller
        const newSeller = await Seller.create({
            sellerName: sellerName,
            sellerEmail: sellerEmail,
            sellerPassword: hashedPwd,
            sellerCity: sellerCity,
            sellerContact: sellerContact    
        })
        res.status(201).json({'success': 'New Seller Added' })
    } catch (err){
        res.status(500).json({'message': err.message })
    }

}

module.exports = {
    getAllSellers,
    addNewSeller
}