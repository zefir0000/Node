const express = require('express');
const router = express.Router();

const PagesController = require('../controllers/PagesController');
const ApplicationsController = require('../controllers/ApplicationsController');
const DBController = require('../controllers/DBController');
const errorsHandler = require('../middlewares/errors');
const productsController = require('../controllers/productsController');

router.get('/', PagesController.home);
router.get('/contact', PagesController.contact);
router.get('/search', PagesController.search);

router.get('/getProducts', DBController.getProducts)
router.get('/getProd', DBController.getProd)
router.get('/getProductById', DBController.getProductById)

router.get('/getProductBase', DBController.getProductBase)



router.get('/upload', PagesController.upload)
      .post('/upload', 
        ApplicationsController.validationUploadFile,
        ApplicationsController.upload
);
router.get('/updateMarket', ApplicationsController.uploadProductsFromG2A)

/*router.post('/applications',
    ApplicationsController.validate,
    ApplicationsController.checkValidation,
    ApplicationsController.normalizeData,
    errorsHandler.catchAsync(ApplicationsController.store)
);*/
//router.get('/products', productsController.search);

module.exports = router;