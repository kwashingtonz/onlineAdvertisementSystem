//Defining ItemCondition Model

module.exports = (sequelize, DataTypes) =>{
    const ItemCondition = sequelize.define("itemcondition",{
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