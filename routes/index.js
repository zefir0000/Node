const express = require('express');
const router = express.Router();

const PagesController = require('../controllers/PagesController');
const ApplicationsController = require('../controllers/ApplicationsController');
const DBController = require('../controllers/DBController');
const MarketController = require('../controllers/MarketController');
const ProductBaseController = require('../controllers/ProductBaseController');
const NewsController = require('../controllers/NewsController');

const errorsHandler = require('../middlewares/errors');


// Pages
router.get('/', PagesController.home);
router.get('/contact', PagesController.contact);
router.get('/search', PagesController.search);

// zaorac
router.get('/getProducts', DBController.getProducts)
router.get('/getProd', DBController.getProd)
router.get('/getProductById', DBController.getProductById)

// Products
router.get('/getProductBaseRelated', DBController.getProductVariantByBaseId)
router.get('/getProductBase', DBController.getProductBase)
// Market
router.get('/market', PagesController.market)
      .post('/marketAdd', 
        errorsHandler.catchAsync(MarketController.createMarket))
      .get('/editMarket/:marketId', PagesController.editMarket)
      .post('/editMarket/:marketId', MarketController.updateMarket)  
      .post('/delMarket/:marketId', MarketController.deleteMarket)  

// ProductBase
router.get('/productBase', PagesController.productBase)
      .post('/productBaseAdd', 
        errorsHandler.catchAsync(ProductBaseController.createProductBase))
      .get('/editproductBase/:productBaseId', PagesController.editProductBase)
      .post('/editproductBase/:productBaseId', ProductBaseController.updateProductBase)  
      .post('/delProductBase/:productBaseId', ProductBaseController.deleteProductBase)  

// News
router.get('/news', PagesController.news)
      .post('/newsAdd', 
        errorsHandler.catchAsync(NewsController.createNews))
      .get('/editNews/:newsId', PagesController.editNews)
      .post('/editNews/:newsId', NewsController.updateNews)  
      .post('/delNews/:newsId', NewsController.deleteNews)  
    
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