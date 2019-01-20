const convertXmlToJson = require('xml-js');
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