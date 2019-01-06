const ProductBase = require('../models/productBase')
const convertXmlToJson = require('xml-js');
const { check, validationResult } = require('express-validator/check');
const knex = require('knex')('../config/knexfile');

function getId(id) {
    return knex('ProductBaseGBP')
            .where('id', id).timeout(1000, { cancel:true });
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
            let productBase = items[--quantityItems];
            let priceWithCurrency = productBase.price._text;
            let price = (priceWithCurrency).substring(0,priceWithCurrency.length - 4);

            getId(productBase.id._text).then(function(product) {
                ProductBase.uploadProductFromXml({
                    'id': productBase.id._text,        
                    'title': productBase.title._text,
                    'link': productBase.link._text,
                    'image': productBase.image_link._text,
                    'price': price,
                    'availability': productBase.availability._text,
                    'shop': shop
                 }, !(JSON.stringify(product) == "[]")).catch();
    });
    } while (quantityItems > 0);
    };
}


