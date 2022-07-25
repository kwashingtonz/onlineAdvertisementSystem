//imports
const db = require('../models')
const { sequelize, Sequelize } = require('../models')


//create main Model
const Category = db.categories
const Item = db.items


//main work 

//get all categories with count of items
const getAllCategoriesWithCount = async (req,res) => {

    const category =  await Category.findAll({
        attributes: {
            include: [
                [sequelize.fn('COUNT',sequelize.col('item.itemId')),'itemCount']
            ]
        } ,
        include:[{
            model: Item,
            as: 'item',
            attributes:[]
        }],
        group: ['category.catId'],
        order: sequelize.literal('itemCount DESC') 
    })

    res.status(200).send({
        categories: category
    })

}


module.exports = {
    getAllCategoriesWithCount
}