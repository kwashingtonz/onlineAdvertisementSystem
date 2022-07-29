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
const ItemImage = db.itemimages

//main work 

//get Item Page
const getAllItems = async (req,res) => {

    let name = req.query.name
    let category = req.query.category
    let city =req.query.city

    const cat =  await Category.findAll()
    const cty = await City.findAll()

    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);

    if(!category && !name && !city){
        //get All Items
        const item =  await Item.findAndCountAll({
            include:[{
                model: Category,
                as: 'category',
                attributes:[]
            },{
                model: ItemImage,
                as: 'itemImage',
                attributes:[
                    'imageName'
                ],
                where:{
                    status:1
                }
            }],
            where: {
                status : 1
            },
            limit, offset
        })

        const pagitem = getPagingData(item, page, limit)

        res.status(200).send({
            categories : cat,
            cities: cty,
            data : pagitem
        })
    }else if(category && !name && !city){
        //get items by category
        const item =  await Item.findAndCountAll({
            include:[{
                model: Category,
                as: 'category',
                attributes:[]
            },{
                model: ItemImage,
                as: 'itemImage',
                attributes:[
                    'imageName'
                ],
                where:{
                    status:1
                }
            }],
            where: {
                catId : category,
                status : 1
            },
            limit, offset
        })
        
        const pagitem = getPagingData(item, page, limit)

        res.status(200).send({
            categories : cat,
            cities: cty,
            data : pagitem
        })
    }else if(!category && name && !city){
        //get items by name
        const item =  await Item.findAndCountAll({

            include:[{
                model: Category,
                as: 'category',
                attributes:[]
            },{
                model: ItemImage,
                as: 'itemImage',
                attributes:[
                    'imageName'
                ],
                where:{
                    status:1
                }
            }],
            where: {
                itemName : {[Sequelize.Op.like]: `%${name}%`},
                status : 1
            },
            limit, offset
        })

        const pagitem = getPagingData(item, page, limit)

        res.status(200).send({
            categories : cat,
            cities: cty,
            data : pagitem
        })
    }else if(!category && !name && city){
        //get items by city
        const item =  await Item.findAndCountAll({

            include:[{
                model: Category,
                as: 'category',
                attributes:[]
            },{
                model: ItemImage,
                as: 'itemImage',
                attributes:[
                    'imageName'
                ],
                where:{
                    status:1
                }
            }],
            where: {
                itemCity : city, 
                status : 1
            },
            limit, offset
        })

        const pagitem = getPagingData(item, page, limit)

        res.status(200).send({
            categories : cat,
            cities: cty,
            data : pagitem
        })
    }else if(category && name && !city){
        //get items by category and name
        const item =  await Item.findAndCountAll({

            include:[{
                model: Category,
                as: 'category',
                attributes:[]
            },{
                model: ItemImage,
                as: 'itemImage',
                attributes:[
                    'imageName'
                ],
                where:{
                    status:1
                }
            }],
            where: {
                catId : category,
                itemName : {[Sequelize.Op.like]: `%${name}%`},
                status : 1
            },
            limit, offset
        })

        const pagitem = getPagingData(item, page, limit)

        res.status(200).send({
            categories : cat,
            cities: cty,
            data : pagitem
        })
    }else if(!category && name && city){
        //get items by name and city
        const item =  await Item.findAndCountAll({

            include:[{
                model: Category,
                as: 'category',
                attributes:[]
            },{
                model: ItemImage,
                as: 'itemImage',
                attributes:[
                    'imageName'
                ],
                where:{
                    status:1
                }
            }],
            where: {
                itemCity : city,
                itemName : {[Sequelize.Op.like]: `%${name}%`},
                status : 1
            },
            limit, offset
        })

        const pagitem = getPagingData(item, page, limit)

        res.status(200).send({
            categories : cat,
            cities: cty,
            data : pagitem
        })
    }else if(category && !name && city){
        //get items by category and city
        const item =  await Item.findAndCountAll({

            include:[{
                model: Category,
                as: 'category',
                attributes:[]
            },{
                model: ItemImage,
                as: 'itemImage',
                attributes:[
                    'imageName'
                ],
                where:{
                    status:1
                }
            }],
            where: {
                catId: category,
                itemCity : city,
                status : 1
            },
            limit, offset
        })

        const pagitem = getPagingData(item, page, limit)

        res.status(200).send({
            categories : cat,
            cities: cty,
            data : pagitem
        })
    }else{
        //get items by category , name and city
        const item =  await Item.findAndCountAll({

            include:[{
                model: Category,
                as: 'category',
                attributes:[]
            },{
                model: ItemImage,
                as: 'itemImage',
                attributes:[
                    'imageName'
                ],
                where:{
                    status:1
                }
            }],
            where: {
                catId: category,
                itemName : {[Sequelize.Op.like]: `%${name}%`},
                itemCity : city,
                status : 1
            },
            limit, offset
        })

        const pagitem = getPagingData(item, page, limit)

        res.status(200).send({
            categories : cat,
            cities: cty,
            data : pagitem
        })
    }
}

//post searched Items
const postSearchItems = (req,res) =>{
    let name = req.body.name
    let category = req.body.category
    let city = req.body.city

    if(!name && !category && !city)
        res.redirect(`/list`)
    else if(name && !category && !city)
        res.redirect(`/list?name=${name}`)
    else if(!name &&  category && !city)
        res.redirect(`/list?category=${category}`)
    else if(!name &&  !category && city)
        res.redirect(`/list?city=${city}`)
    else if(name &&  category && !city)
        res.redirect(`/list?name=${name}&category=${category}`)
    else if(name &&  !category && city)
        res.redirect(`/list?name=${name}&city=${city}`)
    else if(!name &&  category && city)
        res.redirect(`/list?category=${category}&city=${city}`)
    else
        res.redirect(`/list?name=${name}&category=${category}&city=${city}`)
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
        } ,{
            model: ItemImage,
            as: 'itemImage',
            attributes:[
                'imageName' // in the front end split the string and get only the first image as the main image
            ],
            where: {
                status: 1
            }
        } ],
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


//get item by itemId to edit
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
        include:[
            {
                model: ItemImage,
                as: 'itemImage',
                attributes:[
                    'imageName' // in the front end split the string to an array and seperately get the images
                ],
                where:{
                    status: 1
                }
            } 
        ],
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

//Get Item Information to normal user
const getItemInformation = async (req,res) => {
    const itemId = req.query.itemId

    if(!itemId) return res.status(400).json({ 'message' : 'Specify an item id'})
    
    const item =  await Item.findOne({
        include: [{
            model: Seller,
            as: 'seller',
            attributes:[
                'sellerName'
            ]
        },{
            model: ItemImage,
            as: 'itemImage',
            attributes:[
                'imageName' //can split and get the images seperately to put into the slider
            ],
            where:{
                status:1
            }
        }],
        where: {
            itemId : itemId,
            status : 1
        }
    })

    if(!item) return res.status(400).json({ 'message' : 'No such item'})

    res.status(200).send({
        item : item,
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
    const itemImages = req.files

    let itemImgs = []

    if(itemImages){
        for(var count=0; count<itemImages.length; count++){
            itemImgs[count] = itemImages[count].path
        }
    }

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
    

        
            const getItemId = await Item.findOne({
                where:{
                    sellerId: foundSeller.sellerId
                },
                order:[ [ 'itemId', 'DESC' ] ]
            })

            const newImage = await ItemImage.create({
                itemId: getItemId.itemId,
                imageName: itemImgs.toString(),
                status: 1
            }) 
        


        res.redirect('/account')
}


//Edit Item Post
const editItem = async (req,res) => {

    const {itemName,itemCategory,itemCondition,itemPrice,itemDescription,itemCity,itemContact} = req.body

    const itemImages = req.files

    let itemImgs = []

    if(itemImages){
        for(var count=0; count<itemImages.length; count++){
            itemImgs[count] = itemImages[count].path
        }
    }    

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

        if(itemImages){
            const currImgs = await ItemImage.update({
                status: 0
            },{
                where: {
                    itemId : foundItem.itemId,
                    status : 1
                }
            })

            const newImgs = await ItemImage.create({
                itemId: foundItem.itemId,
                imageName: itemImgs.toString(),
                status: 1
            })
        }
    
        res.redirect('/account')
}

//remove images
const delImgs = async (req,res) => {
  
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
   
    const foundItem = await Item.findOne({
        where: {
            itemId : itemId,
            status: 1
        }
    })

    if(!foundItem) return res.sendStatus(403) //Forbidden

    const remImg = await ItemImage.update({
        status : 0
    },{
        where:{
            itemId: foundItem.itemId,
            status: 1
        }
    })
   
    res.redirect('/account/edit?itemId='+foundItem.itemId)
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

const getPagination = (page, size) => {
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;
    return { limit, offset };
  };

  const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: items } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return { totalItems, items, totalPages, currentPage };
  };


module.exports = {
    getAllItems,
    postSearchItems,
    getAllItemsBySeller,
    getItemDetails,
    getItemInformation,
    unpublishItem,
    getAddItemNecessities,
    addItem,
    editItem,
    delImgs
}