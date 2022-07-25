//imports
const db = require('../models')
const { sequelize, Sequelize } = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config();


//create main Model
const Seller = db.sellers


//main work

/* //get All Sellers
const getAllSellers = async (req,res) => {

    const seller =  await Seller.findAll()

    res.status(200).send({
        sellers : seller
    })
} */

//register new seller
const addNewSeller = async (req,res) => {
    const {sellerName,sellerEmail,sellerPassword,sellerCity,sellerContact} = req.body

    //checking all data is available
    if(!sellerName || !sellerEmail || !sellerPassword || !sellerCity || !sellerContact)
        return res.status(400).json({'message': 'All information are required'})

    //check for dupicate sellers
    const duplicate = await Seller.findAll({
        where: {
            sellerEmail : sellerEmail
        }
    })

    if(duplicate.length>0) 
        return res.send({'message': 'Seller already registered' });
    else{
        try{
            //encrypt the password
            const hashedPwd = await bcrypt.hash(sellerPassword, 10)

            //store the new seller
            const newSeller = await Seller.create({
                sellerName: sellerName,
                sellerEmail: sellerEmail,
                sellerPassword: hashedPwd,
                sellerCity: sellerCity,
                sellerContact: sellerContact    
            },{fields : ['sellerName','sellerEmail','sellerPassword','sellerCity','sellerContact'] })
            res.redirect('/login?success='+ encodeURIComponent('yes'))
        } catch (err){
            res.status(500).json({'message': err.message })
        }
    }

}

//Seller Login
const handleSellerLogin = async (req,res) => {
    const {sellerEmail, sellerPassword} = req.body

    if(!sellerEmail || !sellerPassword) return res.status(400).json({'message': 'Email and Password are required'})

    const foundSeller = await Seller.findOne({
        where: {
            sellerEmail : sellerEmail
        }
    })

    if(!foundSeller) 
        return res.redirect('/login?avail='+ encodeURIComponent('no'))
    else{
        //evaluate password
        const match = await bcrypt.compare(sellerPassword, foundSeller.sellerPassword);
        if(match){
             //handle jwt
            const accessToken = jwt.sign(
                {'email' : foundSeller.sellerEmail},
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn : '30s' }
            )
            const refreshToken = jwt.sign(
                {'email' : foundSeller.sellerEmail},
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn : '1d' }
            )
            
            //Saving refresh token with current user
            const addRefreshToken = await Seller.update({
                refreshToken: refreshToken   
            },{
                where : {
                    sellerEmail : foundSeller.sellerEmail
                }
             })

            res.cookie('jwt', refreshToken , {httponly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 })
            res.json({ accessToken })    

            //res.json({'message': `Seller with ${sellerEmail} is logged in `})
        }else{ 
            res.redirect('/login?sucess='+ encodeURIComponent('no'))
        }
    }
    

}


module.exports = {
    //getAllSellers,
    addNewSeller,
    handleSellerLogin
}