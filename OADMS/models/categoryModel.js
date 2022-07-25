module.exports = (sequelize, DataTypes) =>{
    const Category = sequelize.define("category",{
        catId: {
            type: DataTypes.INTEGER,
            primaryKey:true,
            allowNull: false
        },
        catName: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    { 
        timestamps: false 
    })

    return Category
}