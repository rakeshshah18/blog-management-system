const multer = require('multer');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/resources');
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname
        console.log("file form multer. ",fileName)
        // fileName = req.body.image 
        cb(null, fileName);
    },
});

// function uploadFile(req, file){
//     const fileName = file.originalname
//     return fileName;
// }


const upload = multer({
    storage: storage,
    // uploadFile: uploadFile
});

console.log("Details: ",upload)

module.exports = upload ;