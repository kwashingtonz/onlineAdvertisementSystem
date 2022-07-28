//imports
const db = require('../models')
const { sequelize, Sequelize } = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config();


//create main Model
const Seller = db.sellers
const City = db.cities
const Item = db.items
const Category = db.categories
const SellerImage = db.sellerimages


//Time for cookie to be saved
const maxAge = 3 * 24 * 60 * 60

//main work

//register new seller
const addNewSeller = async (req,res) => {
    const {sellerName,sellerEmail,sellerPassword,sellerCity,sellerContact} = req.body
    
    const sellerImage = req.file
    let sellerImg

    if(sellerImage){ 
        sellerImg =sellerImage.path
    }

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
            
            //Image uploading
            if(sellerImage){
                const getSellerId = await Seller.findOne({
                    where:{
                        sellerEmail: sellerEmail
                    }
                })

                const newImage = await SellerImage.create({
                    sellerId: getSellerId.sellerId,
                    imageName: sellerImg,
                    status: 1
                })
            }
            
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
        },{
            model: SellerImage,
            as: 'sellerImage',
            attributes:[
                'imageName'
            ],
            where: { status: 1 }
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
 

//get seller details to the seller Profile
const getSellerInfo = async (req,res) => {
  
    const sellerId = req.query.seller 

    if(!sellerId) return res.status(400).json({ 'message' : 'Specify a sellerId'})

    const foundSeller = await Seller.findOne({
        include:[{
            model: City,
            as: 'city',
            attributes:[
                'cityName'
            ]
        }],
        attributes:{
            exclude: ['sellerId','sellerCity','sellerEmail','sellerPassword']
        },
        where: {
            sellerId : sellerId
        }
    })

    if(!foundSeller) return res.status(400).json({ 'message' : 'No such seller'})
    
    const item =  await Item.findAll({
        include:[{
            model: Category,
            as: 'category',
            attributes:[
                'catName'
            ]
        },{
            model: City,
            as: 'city',
            attributes:[
                'cityName'
            ]
        }],
        attributes:{
            exclude: ['catId','sellerId','itemCondition','itemCity','itemContact','itemDescription','status']
        },
        where: {
            status : 1,
            sellerId : sellerId
        }
    })
    
    if(item.length>0){
        res.status(200).send({
            seller : foundSeller,
            items : item
            })   
    }else{
        res.status(200).send({
            seller : foundSeller,
            message : 'no listings'
            })   
    }



     
   
}

//update SellerDetails
const updateSellerDetails = async (req,res) => {

    const {sellerName,sellerContact,sellerCity,sellerEmail,sellerConfirmPassword,sellerCurrentPassword} = req.body

    const sellerImage = req.file
    let sellerImg

    if(sellerImage){
        sellerImg =sellerImage.path
    }

    if(!sellerName || !sellerContact || !sellerCity ||  !sellerEmail || !sellerCurrentPassword  )
        return res.status(400).json({'message': 'All information are required'})

    const token = req.cookies.jwt
    let sellerEML 
        
    if(token){
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken) => {
            if(err){
                return res.status(400).json({ 'message' : 'jwt error'})
            }else{
                sellerEML = decodedToken.email
            }
        })
    }else{
        res.redirect('/login');
    }
    
    if(!sellerEML) return res.status(400).json({ 'message' : 'User not logged in'})

    const foundSeller = await Seller.findOne({
        where: {
            sellerEmail : sellerEML
        }
    })

    if(!sellerConfirmPassword){
        if(!foundSeller) 
            return res.status(400).json({'message': 'No such seller'})
        else{
            //evaluate password
            const match = await bcrypt.compare(sellerCurrentPassword, foundSeller.sellerPassword);
            if(match){
                const updSeller = await Seller.update({
                    sellerName : sellerName,
                    sellerContact : sellerContact,
                    sellerCity: sellerCity,
                    sellerEmail: sellerEmail
                },{
                    where: {
                        sellerId : foundSeller.sellerId
                    }
                })
                //updating sellerImage
                if(sellerImage){
                    const foundImage = await SellerImage.findOne({
                        where:{
                            sellerId : foundSeller.sellerId,
                            status: 1
                        }
                    })

                    if(!foundImage){
                        const newImage = await SellerImage.create({
                            sellerId: foundSeller.sellerId,
                            imageName: sellerImg,
                            status: 1
                        })
                    }else{
                        const updateImage = await SellerImage.update({  
                            status: 0
                        },{where: {
                                sellerId: foundSeller.sellerId,
                                status: 1
                            }
                        })

                        const newImage = await SellerImage.create({
                            sellerId: foundSeller.sellerId,
                            imageName: sellerImg,
                            status: 1
                        })       
                    }
                }
                
                const tkn = accessToken(sellerEmail)
                res.cookie('jwt', tkn, {httpOnly: true, maxAge: maxAge*1000})
                res.status(400).json({'message': 'Details Updated'})
            }else{ 
                res.status(400).json({'message': 'Current Password is incorrect'})
            }
        }
    }else{
        if(!foundSeller) 
            return res.status(400).json({'message': 'No such seller'})
        else{
            //evaluate password
            const match = await bcrypt.compare(sellerCurrentPassword, foundSeller.sellerPassword);
            if(match){

                const hashedPwd = await bcrypt.hash(sellerConfirmPassword, 10)

                const updSeller = await Seller.update({
                    sellerName : sellerName,
                    sellerContact : sellerContact,
                    sellerCity: sellerCity,
                    sellerEmail: sellerEmail,
                    sellerPassword : hashedPwd
                },{
                    where: {
                        sellerId : foundSeller.sellerId
                    }
                })
                //updating Seller Image
                if(sellerImage){
                    const foundImage = await SellerImage.findOne({
                        where:{
                            sellerId : foundSeller.sellerId,
                            status: 1
                        }
                    })

                    if(!foundImage){
                        const newImage = await SellerImage.create({
                            sellerId: foundSeller.sellerId,
                            imageName: sellerImg,
                            status: 1
                        })
                    }else{
                        const updateImage = await SellerImage.update({  
                            status: 0
                        },{where: {
                                sellerId: foundSeller.sellerId,
                                status: 1
                            }
                        })

                        const newImage = await SellerImage.create({
                            sellerId: foundSeller.sellerId,
                            imageName: sellerImg,
                            status: 1
                        })       
                    }
                }

                const tkn = accessToken(sellerEmail)
                res.cookie('jwt', tkn, {httpOnly: true, maxAge: maxAge*1000})
                res.status(400).json({'message': 'Details Updated'})
            }else{ 
                res.status(400).json({'message': 'Current Password is incorrect'})
            }
        }
    }   
}

//get seller details by sellerEmail
const removeSellerImage = async (req,res) => {
  
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
        where: {
            sellerEmail : sellerEmail
        }
    })

    if(!foundSeller) return res.sendStatus(403) //Forbidden

    const remImg = await SellerImage.update({
        status : 0
    },{
        where:{
            sellerId: foundSeller.sellerId,
            status: 1
        }
    })
   
    res.redirect('/account/settings')
}

    
module.exports = {
    addNewSeller,
    handleSellerLogin,
    getSellerDetails,
    updateSellerDetails,
    getSellerInfo,
    removeSellerImage
}