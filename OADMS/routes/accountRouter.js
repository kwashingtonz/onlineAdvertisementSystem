//imports
const itemController = require('../controllers/itemController')
const sellerController = require('../controllers/sellerController')
const sellerImageMiddleware = require('../middleware/sellerImageUpload')
const itemImageMiddleware = require('../middleware/itemImageUpload')
const router = require('express').Router()


//base route of account router
router.route('/')
    //get all Listings by the seller
    .get(itemController.getAllItemsBySeller)

//add route of account router    
router.route('/add')
    //add listing -- get categories, itemconditions, cities ,sellerContact, sellerCity
    .get(itemController.getAddItemNecessities)
    //save listing
    .post(itemImageMiddleware.upload,itemController.addItem)

//edit route of account router    
router.route('/edit')
    //edit listing --  get categories, itemconditions, cities ,itemContact, itemCity
    .get(itemController.getItemDetails)
    //save edit listing
    .post(itemImageMiddleware.upload,itemController.editItem)

//edit/delimgs route of account router    
router.route('/edit/delimgs')
    //remove item images
    .get(itemController.delImgs)

//delete route of account router
router.route('/delete')
    //delete or unpublish listing
    .get(itemController.unpublishItem)   

//settings route of account router    
router.route('/settings')
    //get seller details
    .get(sellerController.getSellerDetails)
    //update change settings
    .post(sellerImageMiddleware.upload,sellerController.updateSellerDetails)

//settings/imgdel route of account router    
router.route('/settings/imgdel')
    //remove seller image
    .get(sellerController.removeSellerImage)


//exporting module   
module.exports = router