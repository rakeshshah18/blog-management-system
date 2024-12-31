const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../resources');
    },
    filename: (req, file, cb) => {
        console.log("file form multer. ",file)
        const fileName = file.fieldname

        cb(null, fileName);
    },
});


const upload = multer({
    storage: storage
});

module.exports = upload;