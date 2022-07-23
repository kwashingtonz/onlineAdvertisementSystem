const db = require('../models');
const { QueryTypes } = require('sequelize');
const { sequelize, Sequelize } = require('../models');

//create main Model
const Category = db.categories
const Item = db.items

//main work 

//get all categories and count of items

/* const getAllCategoriesWithCount = async (req,res) => {

    let categories = await sequelize.query("SELECT `category`.`catId`, MAX(`category`.`catName`) AS `catName`, COUNT(`item`.`itemId`) AS `itemCount` FROM `categories` AS `category` LEFT OUTER JOIN `items` AS `item` ON `category`.`catId` = `item`.`catId` GROUP BY `category`.`catId`", {type: QueryTypes.SELECT})
    res.status(200).send(categories)

}  */

const getAllCategoriesWithCount = async (req,res) => {

    const data =  await Category.findAll({
        attributes: {
            include: [
                [sequelize.fn('COUNT',sequelize.col('item.itemId')),'itemCount']
            ],
            exclude:[
                'createdAt',
                'updatedAt'
            ]
        } ,
        include:[{
            model: Item,
            as: 'item',
            attributes:[]
        }],
        group: ['category.catId']
    })

    res.status(200).send(data)

}

module.exports = {
    getAllCategoriesWithCount
}