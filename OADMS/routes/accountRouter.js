//imports
const itemController = require('../controllers/itemController')
const sellerController = require('../controllers/sellerController')
const router = require('express').Router()


router.route('/')
    //get all Listings by the seller
    .get(itemController.getAllItemsBySeller)

router.route('/add')
    //add listing -- get categories, itemconditions, cities ,sellerContact, sellerCity
    .get(itemController.getAddItemNecessities)
    //save listing
    .post()

router.route('/edit')
    //edit listing --  get categories, itemconditions, cities ,itemContact, itemCity
    .get(itemController.getItemDetails)
    //save edit listing
    .post()

router.route('/delete')
    //delete or unpublish listing
    .get(itemController.unpublishItem)   

router.route('/settings')
    //get seller details
    .get(sellerController.getSellerDetails)
    //update change settings
    .post(sellerController.updateSellerDetails)


module.exports = router