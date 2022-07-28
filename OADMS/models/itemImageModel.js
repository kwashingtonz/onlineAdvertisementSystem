module.exports = (sequelize, DataTypes) =>{
    const ItemImage = sequelize.define("itemImage",{
       imageItemId: {
            type: DataTypes.INTEGER,
            primaryKey:true
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
    },
    { 
        timestamps: false 
    })

    return ItemImage
}