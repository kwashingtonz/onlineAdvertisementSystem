//imports
const itemController = require('../controllers/itemController')
const sellerController = require('../controllers/sellerController')
const sellerImageMiddleware = require('../middleware/sellerImageUpload')
const router = require('express').Router()


router.route('/')
    //get all Listings by the seller
    .get(itemController.getAllItemsBySeller)

router.route('/add')
    //add listing -- get categories, itemconditions, cities ,sellerContact, sellerCity
    .get(itemController.getAddItemNecessities)
    //save listing
    .post(itemController.addItem)

router.route('/edit')
    //edit listing --  get categories, itemconditions, cities ,itemContact, itemCity
    .get(itemController.getItemDetails)
    //save edit listing
    .post(itemController.editItem)

router.route('/delete')
    //delete or unpublish listing
    .get(itemController.unpublishItem)   

router.route('/settings')
    //get seller details
    .get(sellerController.getSellerDetails)
    //update change settings
    .post(sellerImageMiddleware.upload,sellerController.updateSellerDetails)

router.route('/settings/imgdel')
    .get(sellerController.removeSellerImage)


module.exports = router