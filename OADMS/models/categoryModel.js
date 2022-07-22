module.exports = (sequelize, DataTypes) =>{
    const Category = sequelize.define("category",{
        catId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        catName: {
            type: DataTypes.STRING,
            allowNull: false
        }  
    })

    return Category
}