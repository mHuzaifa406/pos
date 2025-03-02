const express = require('express');
const router = express.Router();

const imageUpload = require('../middlewares/uploadImage');
const fileUpload = require('../middlewares/fileUpload');
const serverPath = require('../middlewares/serverPath');
const checkImageSize = require('../middlewares/checkImageSize');
const checkImgMimeType = require('../middlewares/checkImgMimeType');

router.post('/upload', fileUpload(), checkImageSize, checkImgMimeType, serverPath, imageUpload);

module.exports = router;