const express = require('express');
const router = express.Router();

const PagesController = require('../controllers/PagesController');
const ApplicationsController = require('../controllers/ApplicationsController');
const DBController = require('../controllers/DBController');
const errorsHandler = require('../middlewares/errors');

router.get('/', PagesController.home);
router.get('/contact', PagesController.contact);
router.get('/search', PagesController.search);

router.get('/getProducts', DBController.getProducts)

router.get('/upload', PagesController.upload)
      .post('/upload', 
        ApplicationsController.validationUploadFile,
        ApplicationsController.upload
);

router.post('/applications',
    ApplicationsController.validate,
    ApplicationsController.checkValidation,
    ApplicationsController.normalizeData,
    errorsHandler.catchAsync(ApplicationsController.store)
);

module.exports = router;