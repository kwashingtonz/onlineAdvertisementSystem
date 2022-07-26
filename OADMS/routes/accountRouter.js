//imports
const itemController = require('../controllers/itemController')
const sellerController = require('../controllers/sellerController')
const router = require('express').Router()


router.route('/')
    //get all Listings by the seller
    .get(itemController.getAllItemsBySeller)

router.route('/add')
    //add listing
    .get(((req,res) =>{
            res.send('This is add item page')
        })
    )
    //save listing
    .post()

router.route('/edit')
    //edit listing
    .get(itemController.getItemDetails)

    //save edit listing
    .post()

router.route('/delete')
    //delete or unpublish listing
    .get(itemController.unpublishItem)   

router.route('/settings')
    //get seller details
    .get(((req,res) =>{
        res.send('This is seller settings page')
    }))
    //update change settings
    .post()


module.exports = router