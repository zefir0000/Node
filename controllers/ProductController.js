const convertXmlToJson = require('xml-js');
const convertCsvToJson = require("csvtojson");
const productBaseModel = require('../models/product/productBase')
const productVariantModel = require('../models/product/productVariant')
const UploadService = require('../services/UploadService')

const fs = require('fs')

const dbConfig = require('../config/dbConfig')
const knex = require('knex')(dbConfig);

function getProductBase(title) {
    return knex('ProductBase').select('title', 'productBaseId')
        .where('title', title)
        .timeout(10000, { cancel: true });
};

function getProductVariant(title, shop) {
    return knex('ProductVariant').select('title', 'productBaseId', 'shop', 'productVariantId', 'createdDate')
        .where('title', title)
        .where('shop', shop)
        .timeout(10000, { cancel: true });
};


exports.uploadProductsEneba = async (uploadPath, params) => {
    // convert xml to json
    var xml = fs.readFileSync(uploadPath, 'utf8');
    var json = convertXmlToJson.xml2json(xml, { compact: true, spaces: 0 });

    var string = JSON.stringify(JSON.parse(json)).replace(/"g:/g, '"');
    var products = JSON.parse(string).rss.channel;

    UploadService.uploadProductsEneba(products.item, params.market, params.currency).then((data) => {
        console.log('Quantity products uploaded: ', data)
    })
}

exports.uploadProductsFromG2AToDB = async (products) => {

    // upload info about products to DB
    var shop = "G2A";
    var currency = "EUR";
    var quantityItems = products.length;

    do {
        let item = products[--quantityItems];
        let link = 'https://www.g2a.com' + item.slug;
        let price = parseFloat(item.retail_min_price)
        let availability
        if (item.qty > 0) {
            availability = true;
        } else { availability = false };

        // check productBase
        getProductBase(item.name).then(function (productBase) {

            if (productBase.length > 0) {

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
                            'price': price,
                            'currency': currency,
                            'availability': availability,
                            'shop': shop
                        });
                    })
                });

            } else {
                getProductBase(item.name).then(function (existProductBase) {
                    getProductVariant(item.name, shop).then(function (productVariant) {
                        if (JSON.stringify(productVariant) == '[]') {

                            productVariantModel.createProductVariant({
                                'productBaseId': existProductBase[0].productBaseId,
                                'title': item.name,
                                'link': link,
                                'productShopId': item.id,
                                'price': price,
                                'currency': currency,
                                'availability': availability,
                                'shop': shop
                            });
                        } else {

                            productVariantModel.updateProductVariant({
                                'productVariantId': productVariant[0].productVariantId,
                                'productBaseId': productVariant[0].productBaseId,
                                'title': item.name,
                                'link': link,
                                'productShopId': item.id,
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

exports.uploadProductsHRK = async (uploadPath, params) => {
    // convert csv to json
    convertCsvToJson({ delimiter: [';'] }).fromFile(uploadPath).then((data) => {
      
        UploadService.uploadProductsHRKGames(data, params.market, params.currency).then((data) => {
            console.log('Quantity products uploaded: ', data)
        })
    })
}

exports.uploadProductsCDkeys = async (uploadPath, params) => {
    new Promise(function (resolve, reject) {
        fs.readFile(uploadPath, 'utf8', function (err, txtProducts) {
            var products = []
            var regex = /"[^"]*"/g;
            var delreg = /"/g
            var arrayFieldProducts = txtProducts.match(regex);

            let i = arrayFieldProducts.length / 9
            while (i > 0) {
                i--
                let num = i * 9
                const item = {
                    id: arrayFieldProducts[num].replace(delreg, ""),
                    title: arrayFieldProducts[++num].replace(delreg, ""),
                    url: arrayFieldProducts[++num].replace(delreg, ""),
                    image: arrayFieldProducts[++num].replace(delreg, ""),
                    price: parseFloat(arrayFieldProducts[++num].replace(delreg, "")),
                    platform: arrayFieldProducts[++num].replace(delreg, ""),
                    stock: arrayFieldProducts[++num].replace(delreg, ""),
                    categoryId: arrayFieldProducts[++num].replace(delreg, ""),
                    tags: arrayFieldProducts[++num].replace(delreg, ""),
                }
                products.push(item)
            }
            resolve(products)
        })

    }).then((data) => {
        
        UploadService.uploadProductsCDKeys(data, params.market, params.currency).then((data) => {
            console.log('Quantity products uploaded: ', data)
        })
    })
}
