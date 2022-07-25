//imports
const db = require('../models')
const { sequelize, Sequelize } = require('../models')

const jwt = require('jsonwebtoken')
require('dotenv').config();


//create main Model
const Seller = db.sellers


//main work

//Handling Refresh Token
const handleRefreshToken = async (req,res) => {
    const cookies = req.cookies

    if(!cookies?.jwt) return res.sendStatus(401)

    const refreshToken = cookies.jwt
    
    const foundSeller = await Seller.findOne({
        where: {
            refreshToken : refreshToken
        }
    })

    if(!foundSeller) 
        return res.sendStatus(403); //forbidden
    else{
        //evaluate jwt
       jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundSeller.sellerEmail !== decoded.email) return res.sendStatus(403);
            const accessToken = jwt.sign(
                { 'email': decoded.email },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            )
            res.json( { accessToken }) 
        }
       )
    }
    

}


module.exports = {
    handleRefreshToken
}