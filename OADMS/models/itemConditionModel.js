module.exports = (sequelize, DataTypes) =>{
    const ItemCondition = sequelize.define("itemCondition",{
        itemConditionId: {
            type: DataTypes.INTEGER,
            primaryKey:true,
            allowNull: false
        },
        itemCondition: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    { 
        timestamps: false 
    })

    return ItemCondition
}