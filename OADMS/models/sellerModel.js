module.exports = (sequelize, DataTypes) =>{
    const Seller = sequelize.define("seller",{
       sellerId: {
            type: DataTypes.INTEGER,
            primaryKey:true,
            allowNull: false
        },
        sellerName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sellerEmail: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sellerPassword: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sellerCity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sellerContact: {
            type: DataTypes.STRING,
            allowNull: false
        }       
    })

    return Seller
}