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

    //Request variables over the url
    let name = req.query.name
    let category = req.query.category
    let city =req.query.city

    //Getting Categories and Cities
    const cat =  await Category.findAll()
    const cty = await City.findAll()

    //Server side pagination
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);


    //if no request variables exist
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
        
        //paginated items
        const pagitem = getPagingData(item, page, limit)

        //reponse
        res.status(200).send({
            categories : cat,
            cities: cty,
            data : pagitem
        })

    //If category request variable exist   
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

    //If name request variable exist     
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

    //If city request variable exist     
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

    //If category and name request variables exist     
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

    //If name and city request variables exist     
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

    //If category and city request variables exist     
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

    //If category,name,city request variables exist     
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
    //form-data variables
    let name = req.body.name
    let category = req.body.category
    let city = req.body.city

    //if no form-data exists
    if(!name && !category && !city)
        res.redirect(`/list`)

    //if name form-data exists
    else if(name && !category && !city)
        res.redirect(`/list?name=${name}`)

    //if category form-data exists    
    else if(!name &&  category && !city)
        res.redirect(`/list?category=${category}`)

    //if city form-data exists    
    else if(!name &&  !category && city)
        res.redirect(`/list?city=${city}`)

    //if name and category form-data exists    
    else if(name &&  category && !city)
        res.redirect(`/list?name=${name}&category=${category}`)

    //if name and city form-data exists    
    else if(name &&  !category && city)
        res.redirect(`/list?name=${name}&city=${city}`)

    //if category and city form-data exists    
    else if(!name &&  category && city)
        res.redirect(`/list?category=${category}&city=${city}`)

    //if name,caegory and city form-data exists
    else
        res.redirect(`/list?name=${name}&category=${category}&city=${city}`)
}


//get items by seller
const getAllItemsBySeller = async (req,res) => {
    //get the access token from cookies
    const token = req.cookies.jwt
    let sellerEmail 
    
    //getting seller email from the token
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


    //checking for a user belong to the token
    const foundSeller = await Seller.findOne({
        where: {
            sellerEmail : sellerEmail
        }
    })

    if(!foundSeller) return res.sendStatus(403) //Forbidden


    //Get Items belong to the seller
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
    
    //get the access token from cookies
    const token = req.cookies.jwt
    let sellerEmail 
    
    //getting seller email from the token
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
   
    //checking for seller with the token
    const foundSeller = await Seller.findOne({
        where: {
            sellerEmail : sellerEmail
        }
    })

    if(!foundSeller) return res.sendStatus(403) //Forbidden

    //getting the required item that belongs to the seller
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

    if(!item) return res.sendStatus(403)


    //get categories,cities and itemconditions
    const category =  await Category.findAll()
    const icondition =  await ItemCondition.findAll()
    const city = await City.findAll()

    //get item city name
    const foundCity = await City.findOne({
        where: {
            cityId: item.itemCity
        }
    })

    //sending response
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
    //request variable to get the item
    const itemId = req.query.itemId

    if(!itemId) return res.status(400).json({ 'message' : 'Specify an item id'})
    

    //getting the relevant item
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
    //getting the access token from cookies
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
   
    //getting seller details to put default values to the drop down lists
    const foundSeller = await Seller.findOne({
        where: {
            sellerEmail : sellerEmail
        }
    })

    if(!foundSeller) return res.sendStatus(403) //Forbidden

    //getting the seller's city to put to the drop down as default value
    const foundCity = await City.findOne({
        where: {
            cityId: foundSeller.sellerCity
        }
    })

    //getting category, city and itemconditions to the drop down lists
    const category =  await Category.findAll()
    const icondition =  await ItemCondition.findAll()
    const city = await City.findAll()
    
    //sending response
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
    //request variable
    const itemId = req.query.itemId
    
    //getting the access token from cookies
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

    //getting item that belngs to the user
    const item =  await Item.findOne({
        where: {
            itemId : itemId,
            sellerId : foundSeller.sellerId,
            status : 1
        }
    })
    
    if(!item) return res.sendStatus(403)
    
    //removing item by updating the status as 0
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
    //requsting form-data and files
    const {itemName,itemCategory,itemCondition,itemPrice,itemDescription,itemCity,itemContact} = req.body
    const itemImages = req.files

    let itemImgs = []

    //if itemImages exist
    if(itemImages){
        for(var count=0; count<itemImages.length; count++){
            itemImgs[count] = itemImages[count].path
        }
    }


    //if not all information are given
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
        
        //adding new item
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

            //adding itemimages to the itemimages table in db
            const newImage = await ItemImage.create({
                itemId: getItemId.itemId,
                imageName: itemImgs.toString(),
                status: 1
            }) 
        
        res.redirect('/account')
}


//Edit Item Post
const editItem = async (req,res) => {

    //getting form-data and files
    const {itemName,itemCategory,itemCondition,itemPrice,itemDescription,itemCity,itemContact} = req.body
    const itemImages = req.files

    let itemImgs = []

    //checking if any itemImages are uploaded
    if(itemImages){
        //making a path array of images
        for(var count=0; count<itemImages.length; count++){
            itemImgs[count] = itemImages[count].path
        }
    }    

    //not all information are provided - validation
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

        //get the existing item
        const foundItem= await Item.findOne({
            where: {
                itemId : itemId,
                sellerId : foundSeller.sellerId
            }
        })
    
        if(!foundItem) return res.sendStatus(403) //Forbidden

        //updating the item details
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

        //updating the itemimages if there are new images
        if(itemImages){
            
            const findImg = await ItemImage.findOne({
                where:{
                    itemId : foundItem.itemId,
                    imageName : '',
                    status: 1
                }
            })
            
            if(!findImg){
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
            }else{
                const newImgs = await ItemImage.update({
                    itemId: foundItem.itemId,
                    imageName: itemImgs.toString(),
                    status: 1
                },{where:{
                        itemId : foundItem.itemId,
                        imageName : '',
                        status: 1
                    }
                })
            }    
        }
    
        res.redirect('/account')
}


//remove Item images
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

    const updImg = await ItemImage.create({
                itemId: foundItem.itemId,
                imageName: '',
                status: 1
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

//Pagination Setup
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


//exporting modules
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