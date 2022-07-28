//imports
const db = require('../models')
const { sequelize, Sequelize } = require('../models')
const jwt = require('jsonwebtoken')
require('dotenv').config()

//create main Model
const Category = db.categories
const Item = db.items
const Seller = db.sellers
const City = db.cities
const ItemCondition = db.itemconditions

//main work 

//get All Items
const getAllItems = async (req,res) => {

    const item =  await Item.findAll({
        include:[{
            model: Category,
            as: 'category',
            attributes:[]
        }],
        where: {
            status : 1
        }
    })
    res.status(200).send({
        items : item
    })

}

//post searched Items
const postSearchItems = (req,res) =>{
    let searchName = req.body.searchName
    res.redirect('/items/search?name='+searchName)
}

//get searched Items
const getSearchItems = async (req,res) => {
    
    let searchI = req.query.name
    
    if(!searchI) return res.status(400).json({ 'message' : 'Specify a search name'});
    
    const item =  await Item.findAll({

        include:[{
            model: Category,
            as: 'category',
            attributes:[]
        }],
        where: {
            itemName : searchI,
            status : 1
        }
    })

    res.status(200).send({
        items : item
    })

}

//get items by category
const getAllItemsByCategory = async (req,res) => {

    let cat = req.query.catId

    if(!cat) return res.status(400).json({ 'message' : 'Specify a category type'});

    const item =  await Item.findAll({
        include:[{
            model: Category,
            as: 'category',
            attributes:[]
        }],
        where: {
            status : 1,
            catId : cat
        }
    })
    
    res.status(200).send({
        items : item
    })

}

//get items by seller
const getAllItemsBySeller = async (req,res) => {

    const token = req.cookies.jwt
    let sellerEmail 
    if(token){
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken) => {
            if(err){
                return res.status(400).json({ 'message' : 'jwt error'});
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
        }/* ,{
            model: ItemCondition,
            as: 'itemcondition',
            attributes:[
                'itemCondition'
            ]
        } */],
        attributes:{
            exclude: ['catId','sellerId','itemCondition','itemCity','itemContact','itemDescription','status']
        },
        where: {
            status : 1,
            sellerId : foundSeller.sellerId
        }
    })
    
    if(item.length>0){
        res.status(200).send({
            items : item
        })    
    }else{
        return res.status(400).json({ 'message' : 'No listings'})
    }

   
}


//get item by itemId
const getItemDetails = async (req,res) => {
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
        where: {
            sellerEmail : sellerEmail
        }
    })

    if(!foundSeller) return res.sendStatus(403) //Forbidden

    const item =  await Item.findOne({
        where: {
            itemId : itemId,
            sellerId : foundSeller.sellerId,
            status : 1
        }
    })

    const category =  await Category.findAll()
    const icondition =  await ItemCondition.findAll()
    const city = await City.findAll()

    if(!item) return res.sendStatus(403)
    
    const foundCity = await City.findOne({
        where: {
            cityId: item.itemCity
        }
    })

    res.status(200).send({
        categories : category,
        itemConditions : icondition,
        cities : city,
        item : item,
        details : {
            contact: item.itemContact,
            city : foundCity.cityName
        }
        })    
   
}

//get add item page necessary data
const getAddItemNecessities = async (req,res) => {
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

    const foundCity = await City.findOne({
        where: {
            cityId: foundSeller.sellerCity
        }
    })

    const category =  await Category.findAll()
    const icondition =  await ItemCondition.findAll()
    const city = await City.findAll()
    
    res.status(200).send({
        categories : category,
        itemConditions : icondition,
        cities : city,
        details : {
            contact: foundSeller.sellerContact,
            city : foundCity.cityName
        }
        })    
   
}


//get unpublish item by item id
const unpublishItem = async (req,res) => {
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
        where: {
            sellerEmail : sellerEmail
        }
    })

    if(!foundSeller) return res.sendStatus(403) //Forbidden

    const item =  await Item.findOne({
        where: {
            itemId : itemId,
            sellerId : foundSeller.sellerId,
            status : 1
        }
    })
    
    if(!item) return res.sendStatus(403)
    
    const remItem = await Item.update({
        status :0
    },{
        where: {
            itemId : itemId,
            sellerId : foundSeller.sellerId
        }
    })

    res.redirect('/account')     
   
}

//Add Item
const addItem = async (req,res) => {

    const {itemName,itemCategory,itemCondition,itemPrice,itemDescription,itemCity,itemContact} = req.body

    if(!itemName || !itemCategory || !itemCondition || !itemPrice || !itemDescription || !itemCity || !itemContact)
        return res.status(400).json({'message': 'All information are required'})

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

        const dt = formatDate(new Date()).toString()

        const newItem = await Item.create({
            catId: itemCategory,
            sellerId: foundSeller.sellerId,
            itemName: itemName,
            itemCondition: itemCondition,
            itemPrice: itemPrice,
            itemDateAndTime: dt,
            itemCity: itemCity,
            itemContact: itemContact,
            itemDescription: itemDescription,
            status: 1
        },{fields : ['catId','sellerId','itemName','itemCondition','itemPrice','itemDateAndTime','itemCity','itemContact','itemDescription','status'] })
    
        res.redirect('/account')
}


//Edit Item Post
const editItem = async (req,res) => {

    const {itemName,itemCategory,itemCondition,itemPrice,itemDescription,itemCity,itemContact} = req.body

    if(!itemName || !itemCategory || !itemCondition || !itemPrice || !itemDescription || !itemCity || !itemContact)
        return res.status(400).json({'message': 'All information are required'})

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
            where: {
                sellerEmail : sellerEmail
            }
        })
    
        if(!foundSeller) return res.sendStatus(403) //Forbidden

        const foundItem= await Item.findOne({
            where: {
                itemId : itemId,
                sellerId : foundSeller.sellerId
            }
        })
    
        if(!foundItem) return res.sendStatus(403) //Forbidden

        const updateItem = await Item.update({
            catId: itemCategory,
            itemName: itemName,
            itemCondition: itemCondition,
            itemPrice: itemPrice,
            itemCity: itemCity,
            itemContact: itemContact,
            itemDescription: itemDescription,
            status: 1
        },{
            where: {
                itemId : itemId,
                sellerId : foundSeller.sellerId
            }
        })
    
        res.redirect('/account')
}



//DateTime formating
function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}
  
function formatDate(date) {
    return (
      [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
      ].join('-') +
      ' ' +
      [
        padTo2Digits(date.getHours()),
        padTo2Digits(date.getMinutes()),
        padTo2Digits(date.getSeconds()),
      ].join(':')
    );
}


module.exports = {
    getAllItems,
    postSearchItems,
    getSearchItems,
    getAllItemsByCategory,
    getAllItemsBySeller,
    getItemDetails,
    unpublishItem,
    getAddItemNecessities,
    addItem,
    editItem
}