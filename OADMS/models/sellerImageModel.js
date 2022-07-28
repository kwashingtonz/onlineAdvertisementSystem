module.exports = (sequelize, DataTypes) =>{
    const SellerImage = sequelize.define("sellerImage",{
       imageSellerId: {
            type: DataTypes.INTEGER,
            primaryKey:true
        },
        sellerId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        imageName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false
        }     
    },
    { 
        timestamps: false 
    })

    return SellerImage
}