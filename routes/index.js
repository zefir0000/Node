const express = require('express');
const router = express.Router();

const PagesController = require('../controllers/PagesController');
const UploadController = require('../controllers/UploadController');
const DBController = require('../controllers/DBController');
const MarketController = require('../controllers/MarketController');
const ProductBaseController = require('../controllers/ProductBaseController');
const NewsController = require('../controllers/NewsController');
const FrontCotroller = require('../controllers/FrontController');
const errorsHandler = require('../middlewares/errors');

// Pages backend not important
router.get('/', PagesController.home);
router.get('/contact', PagesController.contact);

// News front
router.get('/getNews', FrontCotroller.getNews) // front
router.get('/getNewsById/:newsId', FrontCotroller.getNewsById) // front
router.get('/getTopTen', FrontCotroller.getTopTen) // front

router.post('/addLike/:newsId', NewsController.addLike) // front
      .post('/addUnlike/:newsId', NewsController.addUnlike) // front

// Products front
router.get('/getProductBaseRelated', DBController.getProductVariantByBaseId) // front
router.get('/getProductBase', DBController.getProductBase) // front 

// Market front
router.get('/market', PagesController.market) // front

// Market backend
router.get('/getMarket', MarketController.getMarket)
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

// News backend
router.get('/news', PagesController.news)
      .post('/newsAdd',
            errorsHandler.catchAsync(NewsController.createNews))
      .get('/editNews/:newsId', PagesController.editNews)
      .post('/editNews/:newsId', NewsController.updateNews)
      .post('/delNews/:newsId', NewsController.deleteNews)

// File backend
router.get('/upload', PagesController.upload)
      .post('/upload',
            UploadController.validationUploadFile,
            errorsHandler.catchAsync(UploadController.upload))
      .get('/uploadG2AProducts',
            errorsHandler.catchAsync(UploadController.uploadProductsFromG2A))

// Mems
router.get('/mems', PagesController.mems)
      .get('/getMems', FrontCotroller.getMems)
      .post('/uploadMem',
            UploadController.validationMemFile,
            errorsHandler.catchAsync(UploadController.uploadMems))
      .post('/delMem/:memId', UploadController.deleteMem)

// backend 
router.get('/trustpilot/:market', UploadController.trustpilot)

router.post('/createUser', PagesController.createUser)

module.exports = router;