//imports
const db = require('../models')
const { sequelize, Sequelize } = require('../models')

//create main Model
const Category = db.categories
const Item = db.items


//main work 

//get All Items
const getAllItems = async (req,res) => {

    const data =  await Item.findAll({
        attributes: {
            exclude:[
                'createdAt',
                'updatedAt'
            ]
        } ,
        include:[{
            model: Category,
            as: 'category',
            attributes:[]
        }],
        where: {
            status : 1
        }
    })
    res.status(200).send(data)

}



//post searched Items
const postSearchItems = (req,res) =>{
    let searchName = req.body.searchName
    res.redirect('/items/search?name='+searchName)
}


//get searched Items
const getSearchItems = async (req,res) => {
    
    let searchI = req.query.name

    if(!searchI) return res.status(400).json({ 'message' : 'Specify a search name'});

    const data =  await Item.findAll({

        attributes: {
            exclude:[
                'createdAt',
                'updatedAt'
            ]
        } ,
        include:[{
            model: Category,
            as: 'category',
            attributes:[]
        }],
        where: {
            itemName : searchI,
            status : 1
        }
    })

    res.status(200).send(data)

}


//get items by category
const getAllItemsByCategory = async (req,res) => {

    let cat = req.query.catId

    const data =  await Item.findAll({
        attributes: {
            exclude:[
                'createdAt',
                'updatedAt'
            ]
        } ,
        include:[{
            model: Category,
            as: 'category',
            attributes:[]
        }],
        where: {
            status : 1,
            catId : cat
        }
    })
    res.status(200).send(data)

}


module.exports = {
    getAllItems,
    postSearchItems,
    getSearchItems,
    getAllItemsByCategory
}