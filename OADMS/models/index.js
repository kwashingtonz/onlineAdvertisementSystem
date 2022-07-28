//imports
const dbConfig = require('../config/dbConfig');

const {Sequelize, DataTypes} = require('sequelize');


//assigning DB configuration to Sequelize
const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorsAliases: false,

        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
)


//Authentication to the DB through Sequelize
sequelize.authenticate()
.then(() => {
    console.log('connected..')
})
.catch(err => {
    console.log(`Error ${err}`)
})


const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize


//Assigning the relevant models to the DB tables
db.categories = require('./categoryModel.js')(sequelize, DataTypes)
db.cities = require('./cityModel.js')(sequelize, DataTypes)
db.itemconditions = require('./itemConditionModel.js')(sequelize, DataTypes)
db.sellers = require('./sellerModel.js')(sequelize, DataTypes)
db.items = require('./itemModel.js')(sequelize, DataTypes)
db.itemimages = require('./itemImageModel.js')(sequelize, DataTypes)
db.sellerimages = require('./sellerImageModel.js')(sequelize, DataTypes)


//Syncronize DB Tables
db.sequelize.sync({ force: false })
.then(() => {
    console.log('yes re-sync done!')
})


//Associations or Relationships (foreignkey)
//Categories has many Items
db.categories.hasMany(db.items,{
    foreignKey: 'catId',
    as: 'item'
})

db.items.belongsTo(db.categories,{
    foreignKey: 'catId',
    as:'category'
})

//Cities has many Items
db.cities.hasMany(db.items,{
    foreignKey: 'itemCity',
    as: 'item'
})

db.items.belongsTo(db.cities,{
    foreignKey: 'itemCity',
    as:'city'
})

//ItemConditions has many Items
db.itemconditions.hasMany(db.items,{
    foreignKey: 'itemCondition',
    as: 'item' 
})

db.items.belongsTo(db.itemconditions,{
    foreignKey: 'itemCondition',
    as: 'itemcondition'
})

//Cities has many sellers
db.cities.hasMany(db.sellers,{
    foreignKey: 'sellerCity',
    as: 'seller'
})

db.sellers.belongsTo(db.cities,{
    foreignKey: 'sellerCity',
    as: 'city'
})


//Sellers has many items
db.sellers.hasMany(db.items,{
    foreignKey: 'sellerId',
    as: 'item'
})

db.items.belongsTo(db.sellers,{
    foreignKey: 'sellerId',
    as: 'seller'
})

//Seller has many seller images
db.sellers.hasMany(db.sellerimages,{
    foreignKey: 'sellerId',
    as: 'sellerImage'
})

db.sellerimages.belongsTo(db.sellers,{
    foreignKey: 'sellerId',
    as: 'seller'
})

//Item has many item images
db.items.hasMany(db.itemimages,{
    foreignKey: 'itemId',
    as: 'itemImage'
})

db.itemimages.belongsTo(db.items,{
    foreignKey: 'itemId',
    as: 'item'
})


module.exports = db