const express = require('express');
const router = express.Router();

const PagesController = require('../controllers/PagesController');
const UploadController = require('../controllers/UploadController');
const MarketController = require('../controllers/MarketController');
const DealController = require('../controllers/DealController');
const ProductBaseController = require('../controllers/ProductBaseController');
const FrontCotroller = require('../controllers/FrontController');
const errorsHandler = require('../middlewares/errors');

// front 
router.get('/getTopTen', FrontCotroller.getTopTen)
router.get('/getMems', FrontCotroller.getMems)
router.get('/getProductBase', FrontCotroller.getProductBase)
router.get('/getProductBaseRelated', FrontCotroller.getProductWithOffer)
router.get('/getDeals', FrontCotroller.getDeals)
router.get('/getUser/:userId', FrontCotroller.getUser)
router.get('/getUserDeals', FrontCotroller.getUserDeals)

router.get('/getUsers/', FrontCotroller.getUsers)
router.post('/getUserByEmail/:email', FrontCotroller.getUserByEmail)
router.post('/createUser/', FrontCotroller.createUser)
router.post('/createAccount/', FrontCotroller.createAccount)

router.post('/upVote/:dealId', FrontCotroller.upVote)
router.post('/front/addDealByUser/', errorsHandler.catchAsync(FrontCotroller.createDealByUser))
router.post('/front/addDealByGuest', errorsHandler.catchAsync(FrontCotroller.createDealByGuest))

// Market backend
router.get('/getMarket', MarketController.getMarket)
      .get('/editMarket/:marketId', MarketController.editMarketPage)
      .get('/addMarket/', MarketController.addMarketPage)
      .post('/addMarket', errorsHandler.catchAsync(MarketController.createMarket))
      .post('/editMarket/:marketId', MarketController.updateMarket)
      .post('/delMarket/:marketId', MarketController.deleteMarket)

// ProductBase backend
router.get('/productBase', ProductBaseController.getProductBase)
      .get('/editProductBase/:productBaseId', ProductBaseController.editProductBasePage)
      .get('/addProductBase/', ProductBaseController.addProductBasePage)
      .post('/addProductBase', errorsHandler.catchAsync(ProductBaseController.createProductBase))
      .post('/editProductBase/:productBaseId', ProductBaseController.updateProductBase)
      .post('/delProductBase/:productBaseId', ProductBaseController.deleteProductBase)

// File backend
router.get('/upload', UploadController.uploadPage)
      .post('/upload',
            //UploadController.validationUploadFile,
            errorsHandler.catchAsync(UploadController.upload))
      .get('/uploadG2AProducts', errorsHandler.catchAsync(UploadController.uploadProductsFromG2A))

// Deals backend
router.get('/deals', DealController.getDeals)
      .get('/editDeal/:dealId', DealController.editDealPage)
      .get('/addDeal/', DealController.addDealPage)
      .post('/addDeal', errorsHandler.catchAsync(DealController.createDeal))
      .post('/editDeal/:dealId', DealController.updateDeal)
      .post('/delDeal/:dealId', DealController.deleteDeal)

// Pages backend not important
router.get('/', PagesController.home);
router.get('/contact', PagesController.contact);


// Mems
router.get('/mems', UploadController.memsPage)
      .post('/uploadMem',
            UploadController.validationMemFile,
            errorsHandler.catchAsync(UploadController.uploadMems))
      .post('/delMem/:memId', UploadController.deleteMem)

// backend 
router.get('/trustpilot/', UploadController.trustpilot)

router.post('/createUser', PagesController.createUser)

module.exports = router;