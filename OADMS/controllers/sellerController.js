//imports
const db = require('../models')
const { sequelize, Sequelize } = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const emailvalidator = require('email-validator')
require('dotenv').config();


//create main Model
const Seller = db.sellers
const City = db.cities
const Item = db.items
const Category = db.categories
const SellerImage = db.sellerimages
const ItemImage = db.itemimages


//Time for cookie to be saved
const maxAge = 3 * 24 * 60 * 60

//main work

//register new seller
const addNewSeller = async (req,res) => {
    //validations
    const {sellerName,sellerEmail,sellerPassword,sellerCity,sellerContact} = req.body //getting form-data
    
    if(!emailvalidator.validate(sellerEmail))
        return res.status(400).send({ message : 'invalid email'})

    const contactregex = /^0[0-9]{9}?$/

    if(!contactregex.test(sellerContact))
        return res.status(400).send({ message : 'invalid contact'})

    const sellerImage = req.file //getting seller image uploaded
    let sellerImg

    if(sellerImage){ 
        sellerImg =sellerImage.path //getting seller image path
    }

    //checking all form-data is available
    if(!sellerName || !sellerEmail || !sellerPassword || !sellerCity || !sellerContact)
        return res.status(400).send({ message : 'All information are required'})

    //check whether seller already registered
    const duplicate = await Seller.findAll({
        where: {
            sellerEmail : sellerEmail
        }
    })

    if(duplicate.length>0) 
        return res.status(400).send({ message : 'Seller already registered' });
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
                //getting the id of the seller
                const getSellerId = await Seller.findOne({
                    where:{
                        sellerEmail: sellerEmail
                    }
                })

                //creating a record in sellerImages table
                const newImage = await SellerImage.create({
                    sellerId: getSellerId.sellerId,
                    imageName: sellerImg,
                    status: 1
                })
            }
            
            return res.status(200).send({ message : 'Registered Sucessfully'}) 
        } catch (err){
            return res.status(500).send({ message : err.message })
        }
    }

}

//Seller Login
const handleSellerLogin = async (req,res) => {
    const {sellerEmail, sellerPassword} = req.body //get form-data

    //checking whether form-data is available
    if(!sellerEmail || !sellerPassword) return res.status(400).send({ message : 'Email and Password are required'})

    //checking whether seller is available
    const foundSeller = await Seller.findOne({
        where: {
            sellerEmail : sellerEmail
        }
    })

    if(!foundSeller) 
       // return res.redirect('/login?avail='+ encodeURIComponent('no'))
       return res.status(400).send({ message : 'Not a registered user'}) //response that seller is not available
    else{
        //if seller available
        //evaluate password
        const match = await bcrypt.compare(sellerPassword, foundSeller.sellerPassword); //comparing the form-data password and registered password
        if(match){
            
            const token = accessToken(foundSeller.sellerEmail) //creating access token
            res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000})//creating a cookie with the access token
            //res.redirect('/account')
            res.status(200).send({ message: 'Logged In Sucessfully',accessToken: token}) // response
        }else{ 
            //res.redirect('/login?sucess='+ encodeURIComponent('no'))
            res.status(400).send({ message : 'Email and Password do not match'})
        }
    }   
}


//Generate access token
const accessToken = (email) => {
    return jwt.sign({email},process.env.ACCESS_TOKEN_SECRET,{ expiresIn : maxAge })
}


//get seller details by sellerEmail
const getSellerDetails = async (req,res) => {
    
    let sellerEmail 
    //getting logged in seller email from headers
    try {
        sellerEmail = req.email.email;
    } catch (e) {
        console.log(e);
        return res.status(400).send({ message : 'Error'})
    }

    if(!sellerEmail) return res.status(401).send({ message : 'Unauthorized'})
   
    //get seller details of the logged in seller including the cityname , seller image
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
                [sequelize.fn('CONCAT','http://localhost:3000/',sequelize.col('imageName')),'imageName']
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

    if(!foundSeller) return res.status(400).send({ message : 'Seller not found' })

    const city =  await City.findAll()//get all cities
    
    //sending response with the seller details and city list
    res.status(200).send({
        //cities : city,
        seller : foundSeller
        })    
   
}
 

//get seller details to the seller Profile
const getSellerInfo = async (req,res) => {
  
    const sellerId = req.query.seller  //getting the seller id from the url parameter

    if(!sellerId) return res.status(400).send({ message : 'Specify a sellerId'}) //if not specified

    //get seller information related to the id
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

    if(!foundSeller) return res.status(400).send({ message : 'Seller not found'}) //if no such seller
    
    //get the seller's listings
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
        },{
            model: ItemImage,
            as: 'itemImage',
            attributes: [
                'imageName'
            ],
            where:{
                status: 1
            }
        }],
        attributes:{
            exclude: ['catId','sellerId','itemCondition','itemCity','itemContact','itemDescription','status']
        },
        where: {
            status : 1,
            sellerId : sellerId
        }
    })
    
    //if there are items
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

    //get form-data 
    const {sellerName,sellerContact,sellerCity,sellerEmail,sellerConfirmPassword,sellerCurrentPassword} = req.body

    if(!emailvalidator.validate(sellerEmail))
        return res.status(400).send({message : 'invalid email'})

    const contactregex = /^0[0-9]{9}?$/

    if(!contactregex.test(sellerContact))
        return res.status(400).send({message : 'invalid contact'})


    const sellerImage = req.file //get seller Image uploaded
    let sellerImg

    if(sellerImage){
        sellerImg =sellerImage.path // get seller image path uploaded
    }

    //checking all necessary information are available
    if(!sellerName || !sellerContact || !sellerCity ||  !sellerEmail || !sellerCurrentPassword  )
        return res.status(400).send({message : 'All information are required'})

        let sellerEML 
        //getting logged in seller email from headers
        try {
            sellerEML = req.email.email;
        } catch (e) {
            console.log(e);
            return res.status(400).send({ message : 'Error'})
        }
    
    if(!sellerEML) return res.status(401).send({ message : 'Unauthorized'})


     //check whether seller already registered
     const duplicate = await Seller.findAll({
        where: {
            sellerEmail : sellerEmail
        }
    })

    if(duplicate[0].sellerEmail != sellerEML) 
        return res.status(400).send({ message : 'Seller email already registered' });

        

    //get seller detials
    const foundSeller = await Seller.findOne({
        where: {
            sellerEmail : sellerEML
        }
    })

    //if a new password is not entered
    if(!sellerConfirmPassword){
        //checking seller is available
        if(!foundSeller) 
            return res.status(400).send({ message : 'Seller not found'})
        else{
            //evaluate password
            const match = await bcrypt.compare(sellerCurrentPassword, foundSeller.sellerPassword); //comparing form-data password and registered password
            //if passwords match
            if(match){
                //update seller details
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
                    
                    //if no seller image is uploaded before or removed
                    if(!foundImage){
                        //inserting new image
                        const newImage = await SellerImage.create({
                            sellerId: foundSeller.sellerId,
                            imageName: sellerImg,
                            status: 1
                        })
                    }else{
                        
                        if(foundImage.imageName == ""){
                            const updateImage = await SellerImage.update({  
                                imageName: sellerImg
                            },{where: {
                                    sellerId: foundSeller.sellerId,
                                    imageName: "",
                                    status: 1
                                }
                            })
                        }else{

                            //if seller image is uploaded at registration 
                            //updating status of old seller image
                            const updateImage = await SellerImage.update({  
                                status: 0
                            },{where: {
                                    sellerId: foundSeller.sellerId,
                                    status: 1
                                }
                            })
                            //insert new seller image
                            const newImage = await SellerImage.create({
                                sellerId: foundSeller.sellerId,
                                imageName: sellerImg,
                                status: 1
                            })
                        }       
                    }
                }
                
                /* const tkn = accessToken(sellerEmail) //new access token when email has been updated
                res.cookie('jwt', tkn, {httpOnly: true, maxAge: maxAge*1000}) //updating cookie */
                req.email = null
                res.cookie('jwt','',{ maxAge: 1 })
                res.status(200).send({message : 'Details Updated and Logged Out'}) // response
            }else{ 
                res.status(400).send({message : 'Current Password is incorrect'})// if current password and registered password do not match
            }
        }
    }else{
        //if new password entered
        //check for seller existence
        if(!foundSeller) 
            return res.status(400).send({ message : 'Seller not found'})
        else{
            //evaluate password
            const match = await bcrypt.compare(sellerCurrentPassword, foundSeller.sellerPassword); // compare the current password and registered password
            //if matched
            if(match){

                const hashedPwd = await bcrypt.hash(sellerConfirmPassword, 10) //converting the new password into bcrypt format

                //updating seller details
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
                //if a seller image is uplaoded
                if(sellerImage){
                    //checking for current image
                    const foundImage = await SellerImage.findOne({
                        where:{
                            sellerId : foundSeller.sellerId,
                            status: 1
                        }
                    })
                    //no current image
                    if(!foundImage){
                        //create new record for new seller image
                        const newImage = await SellerImage.create({
                            sellerId: foundSeller.sellerId,
                            imageName: sellerImg,
                            status: 1
                        })
                    }else{
                        //if there's a current seller image
                        //update status of current image
                        const updateImage = await SellerImage.update({  
                            status: 0
                        },{where: {
                                sellerId: foundSeller.sellerId,
                                status: 1
                            }
                        })
                        //insert new record of new image
                        const newImage = await SellerImage.create({
                            sellerId: foundSeller.sellerId,
                            imageName: sellerImg,
                            status: 1
                        })       
                    }
                }

                /* const tkn = accessToken(sellerEmail) //create new access token when email changed
                res.cookie('jwt', tkn, {httpOnly: true, maxAge: maxAge*1000}) // update cookie with the new access token
                res.status(400).json({'message': 'Details Updated', 'acessToken' : tkn}) //response */
                req.email = null
                res.cookie('jwt','',{ maxAge: 1 })
                return res.status(200).send({message : 'Details Updated and Logged Out'})
            }else{ 
                return res.status(400).send({message : 'Current Password is incorrect'}) //if passwords do not match with the registered
            }
        }
    }   
}

//get seller details by sellerEmail
const removeSellerImage = async (req,res) => {
  
    let sellerEmail 
    //getting logged in seller email from headers
    try {
        sellerEmail = req.email.email;
    } catch (e) {
        console.log(e);
        return res.status(400).send({ message : 'Error'})
    }

    if(!sellerEmail) return res.status(401).send({ message : 'Unauthorized'})
   
    //get seller details
    const foundSeller = await Seller.findOne({
        where: {
            sellerEmail : sellerEmail
        }
    })

    if(!foundSeller) return res.status(400).send({ message : 'Seller not found' })

    //update status of the current image as 0 to remove
    const remImg = await SellerImage.update({
        status : 0
    },{
        where:{
            sellerId: foundSeller.sellerId,
            status: 1
        }
    })

    //create a path blank image
    const blnkImg = await SellerImage.create({
        sellerId: foundSeller.sellerId,
        imageName: '',
        status: 1
    })
   
    //res.redirect('/account/settings') // redirect or response to go back to account settings
    return res.status(200).send({message : 'Avatar Removed'})
}


//exporitng modules    
module.exports = {
    addNewSeller,
    handleSellerLogin,
    getSellerDetails,
    updateSellerDetails,
    getSellerInfo,
    removeSellerImage
}