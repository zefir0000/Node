const ProductFromFile = require('../models/productFromFile')
const convertXmlToJson = require('xml-js');
const { check, validationResult } = require('express-validator/check');
const dbConfig = require('../config/dbConfig')
const knex = require('knex')(dbConfig);

function getProductId(productId) {

    return knex('ProductBaseGBP')
            .where('productId', productId).timeout(1000, { cancel:true });
        };


exports.uploadProducts = async (uploadPath) => {
    // convert xml to json
    var xml = require('fs').readFileSync(uploadPath, 'utf8');           
    var json = convertXmlToJson.xml2json(xml, {compact: true, spaces: 0});

    var string = JSON.stringify(JSON.parse(json)).replace(/"g:/g, '"');
    var products = JSON.parse(string).rss.channel;

    // upload info about products to DB
    var shop = products.title._text;
    var currency = (products.title._text).slice(-3);
    var items = products.item;
    var quantityItems = items.length;

    if (currency == 'GBP') {
        do {
            let item = items[--quantityItems];
            let priceWithCurrency = item.price._text;
            let price = (priceWithCurrency).substring(0,priceWithCurrency.length - 4);
            let currency = (priceWithCurrency).slice(- 3);
            let availabilityDate = (item.availability_date._text).substring(0,10); // get only date rrrr-mm-dd

            getProductId(item.id._text).then(function(productExist) {
                ProductFromFile.uploadProductFromXml({

                    'productId': item.id._text,       
                    'title': item.title._text,
                    'description': item.description._text,
                    'link': item.link._text,
                    'imageLink': item.image_link._text,
                    'price': price,
                    'currency': currency,
                    'availability': item.availability._text,
                    'availabilityDate': availabilityDate,
                    'googleProductCategory': item.google_product_category._text,
                    'brand': item.brand._text,
                    'condition': item.condition._text,
                    'identifierExist': item.identifier_exists._text,
                    'gtin': item.gtin._text,
                    'mpn': item.mpn._text,
                    'shop': shop,
                 }, productExist);
    });
        } while (quantityItems > 0);
    };
}


// (err) => { console.log('Error: ', err); }  !(JSON.stringify(productExist) == "[]")