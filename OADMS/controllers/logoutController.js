//imports
const db = require('../models')
const { sequelize, Sequelize } = require('../models')


//create main Model
const Seller = db.sellers


//main work

//Handling Logout
const handleLogout= async (req,res) => {
    // on client, also delete the accessToken
    
    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(204) // no content
  
    const refreshToken = cookies.jwt
    
    //Is Refresh Token in db?
    const foundSeller = await Seller.findOne({
        where: {
            refreshToken : refreshToken
        }
    })

    if(!foundSeller){
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }) 
        return res.sendStatus(204);
    }
    
    const removeRefreshToken = await Seller.update({
        refreshToken: ''  
    },{
        where : {
            sellerEmail : foundSeller.sellerEmail
        }
     })

     res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }); // secure: true - only serves on https
     res.redirect('/')

}


module.exports = {
    handleLogout
}