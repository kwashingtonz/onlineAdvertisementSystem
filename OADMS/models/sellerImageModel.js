module.exports = (sequelize, DataTypes) =>{
    const SellerImage = sequelize.define("sellerImage",{
       imageSellerId: {
            type: DataTypes.INTEGER,
            primaryKey:true,
            allowNull: false
        },
        sellerId: {
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

    return SellerImage
}