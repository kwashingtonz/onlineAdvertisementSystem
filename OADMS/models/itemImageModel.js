module.exports = (sequelize, DataTypes) =>{
    const ItemImage = sequelize.define("itemImage",{
       imageItemId: {
            type: DataTypes.INTEGER,
            primaryKey:true,
            allowNull: false
        },
        itemId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        imageName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false
        }       
    })

    return ItemImage
}