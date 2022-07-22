const db = require('../models')
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');

//create main Model
const Category = db.categories

//main work 

//get all categories and count of items

const getAllCategoriesWithCount = async (req,res) => {

    let categories = await sequelize.query("Select categories.catId AS catId,MAX(categories.catName) AS catName, COUNT(items.itemId) AS itemCount FROM categories LEFT JOIN items ON categories.catId = items.catId GROUP BY categories.catId", {type: QueryTypes.SELECT})
    /* let categories = await Category.findAll({
        attributes: [
            'catId',
            'catName'
        ] 
    }) */
    res.status(200).send(categories)

}

module.exports = {
    getAllCategoriesWithCount
}