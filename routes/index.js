const express = require('express');
const router = express.Router();

const PagesController = require('../controllers/PagesController');
const ApplicationsController = require('../controllers/ApplicationsController');
const DBController = require('../controllers/DBController');
const MarketController = require('../controllers/MarketController');
const AdminMarketController = require('../controllers/admin/AdminMarketCotroller');


const errorsHandler = require('../middlewares/errors');
// Pages
router.get('/', PagesController.home);
router.get('/contact', PagesController.contact);
router.get('/search', PagesController.search);
router.get('/market', PagesController.market);

// zaorac
router.get('/getProducts', DBController.getProducts)
router.get('/getProd', DBController.getProd)
router.get('/getProductById', DBController.getProductById)

// Products
router.get('/getProductBaseRelated', DBController.getProductVariantByBaseId)
router.get('/getProductBase', DBController.getProductBase)
// Market
router.get('/getMarket', AdminMarketController.getMarket)
      .post('/market', MarketController.createMarket)
      .put('/market/:marketId', MarketController.updateMarket)  
      .delete('/market/:marketId', MarketController.deleteMarket)  
    
// File
router.get('/upload', PagesController.upload)
      .post('/upload', 
        ApplicationsController.validationUploadFile,
        errorsHandler.catchAsync(ApplicationsController.upload))

// router.get('/updateMarket', ApplicationsController.uploadProductsFromG2A)

router.get('/trustpilot', ApplicationsController.trustpilot)


/*router.post('/applications',
    ApplicationsController.validate,
    ApplicationsController.checkValidation,
    ApplicationsController.normalizeData,
    errorsHandler.catchAsync(ApplicationsController.store)
);*/
//router.get('/products', productsController.search);

module.exports = router;