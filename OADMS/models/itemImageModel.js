//Defining Item Image Model

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
            allowNull: true,
            get(){
                const imgNm = this.getDataValue('imageName')
                //imgNm ? imgNm.split(',') : null      
                var imgArray = []
                for(var len=0;len<imgNm.split(',').length;len++){
                    imgArray[len] = 'http://localhost:3000/'+imgNm.split(',') [len]
                }
                return imgArray
            }
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