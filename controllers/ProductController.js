const convertXmlToJson = require('xml-js');
const convertCsvToJson = require("csvtojson/v2");
const { check, validationResult } = require('express-validator/check');
const productBaseModel = require('../models/product/productBase')
const productVariantModel = require('../models/product/productVariant')

const dbConfig = require('../config/dbConfig')
const knex = require('knex')(dbConfig);

function getProductBase(title) {
    return knex('ProductBase').select('title', 'productBaseId')
        .where('title', title)
        .timeout(1000, { cancel: true });
};

function getProductVariant(title, shop) {
    return knex('ProductVariant').select('title', 'productBaseId', 'shop', 'productVariantId', 'createdDate')
        .where('title', title)
        .where('shop', shop)
        .timeout(1000, { cancel: true });
};


exports.uploadProducts = async (uploadPath) => {
    // convert xml to json
    var xml = require('fs').readFileSync(uploadPath, 'utf8');
    var json = convertXmlToJson.xml2json(xml, { compact: true, spaces: 0 });

    var string = JSON.stringify(JSON.parse(json)).replace(/"g:/g, '"');
    var products = JSON.parse(string).rss.channel;

    // check productBase

    var shop = products.title._text;
    var currency = (products.title._text).slice(-3);
    var items = products.item;
    var quantityItems = items.length;
    do {

        let item = items[--quantityItems];
        let priceWithCurrency = item.price._text;
        let price = (priceWithCurrency).substring(0, priceWithCurrency.length - 4);

        let availability;
        if (item.availability._text == 'in stock')
            availability = true;
        else (availability = false)

        getProductBase(item.title._text).then(function (productBase) {

            if (JSON.stringify(productBase) == '[]') {

                productBaseModel.createProductBase({
                    'title': item.title._text,
                    'description': item.description._text,
                    'image': item.image_link._text,
                    'platform': item.brand._text,

                }).then(function () {

                    getProductBase(item.title._text).then(function (newProductBase) {

                        productVariantModel.createProductVariant({
                            'productBaseId': newProductBase[0].productBaseId,
                            'title': item.title._text,
                            'link': item.link._text,
                            'productShopId': item.id._text,
                            'price': price,
                            'currency': currency,
                            'availability': availability,
                            'shop': shop
                        });
                    })
                });

            } else {
                getProductBase(item.title._text).then(function (existProductBase) {
                    getProductVariant(item.title._text, shop).then(function (productVariant) {
                        if (JSON.stringify(productVariant) == '[]') {

                            productVariantModel.createProductVariant({
                                'productBaseId': existProductBase[0].productBaseId,
                                'title': item.title._text,
                                'link': item.link._text,
                                'productShopId': item.id._text,
                                'price': price,
                                'currency': currency,
                                'availability': availability,
                                'shop': shop
                            });
                        } else {

                            productVariantModel.updateProductVariant({
                                'productVariantId': productVariant[0].productVariantId,
                                'productBaseId': productVariant[0].productBaseId,
                                'title': item.title._text,
                                'link': item.link._text,
                                'productShopId': item.id._text,
                                'price': price,
                                'currency': currency,
                                'availability': availability,
                                'createdDate': productVariant[0].createdDate,
                                'shop': shop
                            });
                        }
                    });
                });

            }
        });
    } while (quantityItems > 0);
}

exports.uploadProductsFromCSV = async (uploadPath) => {
    // convert xml to json
    // var xml = require('fs').readFileSync(uploadPath, 'utf8');
    var json = convertCsvToJson.fromFile(uploadPath).then((json) => {
        console.log(json)
    })

    // var string = JSON.stringify(JSON.parse(json)).replace(/"g:/g, '"');
    // var products = JSON.parse(string).rss.channel;

    // // upload info about products to DB
    // var shop = products.title._text;
    // var currency = (products.title._text).slice(-3);
    // var items = products.item;
    // var quantityItems = items.length;

    // if (currency == 'USD') {
    //     do {
    //         let item = items[--quantityItems];
    //         let priceWithCurrency = item.price._text;
    //         let price = (priceWithCurrency).substring(0, priceWithCurrency.length - 4);
    //         let currency = (priceWithCurrency).slice(- 3);

    //let availabilityDate = (item.availability_date._text).substring(0,10); // get only date rrrr-mm-dd


    // getProductId(item.id._text, shop).then(function (productExist) {
    //     uploadProductFromShop.uploadProductFromShop({

    //         'productId': item.id._text,
    //         'title': item.title._text,
    //         'description': item.description._text,
    //         'link': item.link._text,
    //         'imageLink': item.image_link._text,
    //         'price': price,
    //         'currency': currency,
    //         'availability': item.availability._text,
    //         'brand': item.brand._text,
    //         'description': item.description._text,
    //         'shop': shop,
    //     }, productExist);
    // });
    //     } while (quantityItems > 0);
    // };
}

exports.uploadProductsFromG2AToDB = async (products) => {

    // upload info about products to DB
    var shop = "G2A";
    var currency = "EUR";
    var quantityItems = products.length;
    console.log(products)

    do {
        let item = products[--quantityItems];
        let link = 'https://www.g2a.com' + item.slug;
        let availability
        if (item.qty > 0) {
            availability = true;
        } else { availability = false };

        // check productBase
        getProductBase(item.name).then(function (productBase) {

            if (JSON.stringify(productBase) == '[]') {

                productBaseModel.createProductBase({
                    'title': item.name,
                    'description': item.description,
                    'image': item.smallImage,
                    'platform': item.platform,

                }).then(function () {

                    getProductBase(item.name).then(function (newProductBase) {

                        productVariantModel.createProductVariant({
                            'productBaseId': newProductBase[0].productBaseId,
                            'title': item.name,
                            'link': link,
                            'productShopId': item.id,
                            'price': item.retail_min_price,
                            'currency': currency,
                            'availability': availability,
                            'shop': shop
                        });
                    })
                });

            } else {
                getProductBase(item.title._text).then(function (existProductBase) {
                    getProductVariant(item.title._text, shop).then(function (productVariant) {
                        if (JSON.stringify(productVariant) == '[]') {

                            productVariantModel.createProductVariant({
                                'productBaseId': existProductBase[0].productBaseId,
                                'title': item.title._text,
                                'link': item.link._text,
                                'productShopId': item.id._text,
                                'price': price,
                                'currency': currency,
                                'availability': availability,
                                'shop': shop
                            });
                        } else {

                            productVariantModel.updateProductVariant({
                                'productVariantId': productVariant[0].productVariantId,
                                'productBaseId': productVariant[0].productBaseId,
                                'title': item.title._text,
                                'link': item.link._text,
                                'productShopId': item.id._text,
                                'price': price,
                                'currency': currency,
                                'availability': availability,
                                'createdDate': productVariant[0].createdDate,
                                'shop': shop
                            });
                        }
                    });
                });

            }
        });
        //     } while (quantityItems > 0);
        // }
        //         let prodId = item.id;
        // getProductId(prodId, shop).then(function (productExist) { // do poprawy exist bo cos nie bangla 

        //     uploadProductFromShop.uploadProductFromShop({

        //         'productId': item.id,
        //         'title': item.name,
        //         'description': item.description,
        //         'link': link,
        //         'imageLink': item.smallImage,
        //         'price': item.retail_min_price,
        //         'currency': currency,
        //         'availability': availability,
        //         'description': item.description,
        //         'brand': item.platform,
        //         'shop': shop,
        //     }, productExist);

        // });
    } while (quantityItems > 0);

}