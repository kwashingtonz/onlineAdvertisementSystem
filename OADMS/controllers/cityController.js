//imports
const db = require('../models')
const { sequelize, Sequelize } = require('../models')


//create main Model
const City = db.cities


//main work 

//get All Cities
const getAllCities = async (req,res) => {

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

module.exports = {
    getAllCities
}