//imports
const db = require('../models')
const { sequelize, Sequelize } = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config();


//create main Model
const Seller = db.sellers
const City = db.cities


//Time for cookie to be saved
const maxAge = 3 * 24 * 60 * 60

//main work

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
       // return res.redirect('/login?avail='+ encodeURIComponent('no'))
       return res.status(400).json({'message': 'Not a registered user'})
    else{
        //evaluate password
        const match = await bcrypt.compare(sellerPassword, foundSeller.sellerPassword);
        if(match){
            
            const token = accessToken(foundSeller.sellerEmail)
            res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000})
            res.redirect('/account')
        }else{ 
            //res.redirect('/login?sucess='+ encodeURIComponent('no'))
            res.status(400).json({'message': 'Email and Password do not match'})
        }
    }   
}


//Generate access token
const accessToken = (email) => {
    return jwt.sign({email},process.env.ACCESS_TOKEN_SECRET,{ expiresIn : maxAge })
}


//get seller details by sellerEmail
const getSellerDetails = async (req,res) => {
    const itemId = req.query.itemId
    
    const token = req.cookies.jwt
    let sellerEmail 
    
    if(token){
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken) => {
            if(err){
                return res.status(400).json({ 'message' : 'jwt error'})
            }else{
                sellerEmail = decodedToken.email
            }
        })
    }else{
        res.redirect('/login');
    }

    if(!sellerEmail) return res.status(400).json({ 'message' : 'User not logged in'})
   
    const foundSeller = await Seller.findOne({
        include:[{
            model: City,
            as: 'city',
            attributes:[
                'cityName'
            ]
        }],
        attributes:{
            exclude: ['sellerPassword']
        },
        where: {
            sellerEmail : sellerEmail
        }
    })

    if(!foundSeller) return res.sendStatus(403) //Forbidden

    const city =  await City.findAll()
    
    res.status(200).send({
        cities : city,
        seller : foundSeller
        })    
   
}
   
//update SellerDetails
const updateSellerDetails = async (req,res) => {

}

    
module.exports = {
    addNewSeller,
    handleSellerLogin,
    getSellerDetails,
    updateSellerDetails
}