module.exports = (sequelize, DataTypes) =>{
    const Item = sequelize.define("item",{
       itemId: {
            type: DataTypes.INTEGER,
            primaryKey:true,
            allowNull: false
        },
        catId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sellerId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        itemName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        itemCondition: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        itemPrice: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        itemDateAndTime: {
            type: DataTypes.DATE,
            allowNull: false
        },
        itemCity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        itemContact: {
            type: DataTypes.STRING,
            allowNull: false
        },
        itemDescription: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false
        }     
    },
    { 
        timestamps: false 
    })

    return Item
}