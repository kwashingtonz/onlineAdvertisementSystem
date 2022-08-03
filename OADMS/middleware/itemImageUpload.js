//ItemImages uploading

//imports
const multer = require('multer')
const path = require('path')


//configuring storage path
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images/itemimages")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})


//Defining upload object using multer with limits and supporting extension types 
const upload = multer({
    storage: storage,
    limits: { fileSize: '5000000'},
     fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/
        const mimeType = fileTypes.test(file.mimetype)
        const extname = fileTypes.test(path.extname(file.originalname))

        if(mimeType && extname){
            return cb(null, true)
        }
        cb('Give proper file formats to upload') 
    }
    
}).array('itemImages', 4)


//exporting module
module.exports = {
    upload
}