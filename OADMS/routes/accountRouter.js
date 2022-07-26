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
            res.send('This is add post page')
        })
    )
    //save listing
    .post()

router.route('/edit')
    //edit listing
    .get()
    //save edit listing
    .post()

router.route('/delete')
    //delete or unpublish listing
    .get()   

router.route('/settings')
    //get seller details
    .get()
    //update change settings
    .post()


module.exports = router