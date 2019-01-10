const uploadProductFromShop = require('../models/productFromShop')
const convertXmlToJson = require('xml-js');
const { check, validationResult } = require('express-validator/check');
const dbConfig = require('../config/dbConfig')
const knex = require('knex')(dbConfig);

function getProductId(productId, shop) {

    return knex('ProductsFromShopsUSD')
            .where('productId', productId)
            .where('shop', shop)
            .timeout(1000, { cancel:true });
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

    if (currency == 'USD') {
        do {
            let item = items[--quantityItems];
            let priceWithCurrency = item.price._text;
            let price = (priceWithCurrency).substring(0,priceWithCurrency.length - 4);
            let currency = (priceWithCurrency).slice(- 3);
            //let availabilityDate = (item.availability_date._text).substring(0,10); // get only date rrrr-mm-dd


            getProductId(item.id._text, shop).then(function(productExist) {
                uploadProductFromShop.uploadProductFromShop({

                    'productId': item.id._text,       
                    'title': item.title._text,
                    'description': item.description._text,
                    'link': item.link._text,
                    'imageLink': item.image_link._text,
                    'price': price,
                    'currency': currency,
                    'availability': item.availability._text,
                    'brand': item.brand._text,
                    'shop': shop,
                 }, productExist);
    });
        } while (quantityItems > 0);
    };
}

exports.uploadProductsFromG2AToDB = async (products) => {

    // upload info about products to DB
    var shop = "Market G2A";
    var currency = "USD";
    var quantityItems = products.length;
    
        do {
            let item = products[--quantityItems];
            let link = 'https://www.g2a.com' + item.slug;
            let availability
            if (item.qty > 0) 
            {
                availability = "in stock";
            } else { availability = "out of stock" }; // do poprawy na bool
           
            let prodId = item.id;
            getProductId(prodId, shop).then(function(productExist) {

                uploadProductFromShop.uploadProductFromShop({

                    'productId': item.id,
                    'title': item.name,
                    'description': item.description,
                    'link': link,
                    'imageLink': item.thumbnail,
                    'price': item.retail_min_price,
                    'currency': currency,
                    'availability': availability,
                    'brand': item.platform,
                    'shop': shop,
                 }, productExist); // do poprawy na bool
                 
        });
        } while (quantityItems > 0);
    
}


// (err) => { console.log('Error: ', err); }  !(JSON.stringify(productExist) == "[]")