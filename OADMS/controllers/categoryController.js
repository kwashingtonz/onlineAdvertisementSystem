const db = require('../models')

//create main Model
const Category = db.categories

//main work 

//get all categories

const getAllCategories = async (req,res) => {

    let categories = await Category.findAll({
        attributes: [
            'catId',
            'catName'
        ]
    })
    res.status(200).send(categories)

}

module.exports = {
    getAllCategories
}