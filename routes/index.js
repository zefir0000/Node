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

// Pages
router.get('/', PagesController.home);
router.get('/contact', PagesController.contact);

// front
router.get('/getNews', FrontCotroller.getNews)
router.get('/getTopTen', FrontCotroller.getTopTen)

// Products
router.get('/getProductBaseRelated', DBController.getProductVariantByBaseId)
router.get('/getProductBase', DBController.getProductBase)

// Market
router.get('/market', PagesController.market)
      .get('/getMarket', PagesController.getMarket)
      .post('/marketAdd', errorsHandler.catchAsync(MarketController.createMarket))
      .get('/editMarket/:marketId', PagesController.editMarket)
      .post('/editMarket/:marketId', errorsHandler.catchAsync(MarketController.updateMarket))  
      .post('/delMarket/:marketId', errorsHandler.catchAsync(MarketController.deleteMarket))

// ProductBase
router.get('/productBase', PagesController.productBase)
      .post('/productBaseAdd', errorsHandler.catchAsync(ProductBaseController.createProductBase))
      .get('/editproductBase/:productBaseId', PagesController.editProductBase)
      .post('/editproductBase/:productBaseId', errorsHandler.catchAsync(ProductBaseController.updateProductBase))
      .post('/delProductBase/:productBaseId', errorsHandler.catchAsync(ProductBaseController.deleteProductBase))

// News
router.get('/news', PagesController.news)
      .post('/newsAdd', errorsHandler.catchAsync(NewsController.createNews))
      .get('/editNews/:newsId', PagesController.editNews)
      .post('/editNews/:newsId', errorsHandler.catchAsync(NewsController.updateNews))
      .post('/delNews/:newsId', errorsHandler.catchAsync(NewsController.deleteNews))
      .post('/addLikeNews/:newsId', errorsHandler.catchAsync(NewsController.addlikeForNews))  
    
// File
router.get('/upload', PagesController.upload)
      .post('/upload', UploadController.validationUploadFile, errorsHandler.catchAsync(UploadController.upload))

// Mems
router.get('/mems', PagesController.mems)
      .post('/uploadMem', UploadController.validationMemFile, errorsHandler.catchAsync(UploadController.uploadMems))
// Trust pilot
router.get('/trustpilot', UploadController.trustpilot) // zaimplementowac baze danych polaczyc z marketem dodac zarzadzanie 
                                                       // aktualizacja dac endpoint do wyswietlania lub tylko ogarnac wyswietlanie po zapukaniu
module.exports = router;