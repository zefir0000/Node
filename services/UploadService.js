const productBaseModel = require('../models/product/productBase')
const productVariantModel = require('../models/product/productVariant')
const ProductService = require('./ProductService')

module.exports = {
    uploadProductsCDKeys: async (data, shop, currency) => {
        var quantityItems = data.length;
        do {
            let item = data[--quantityItems];
            let availability;
            if (item.stock == "In Stock")
                availability = true;
            else (availability = false)

            ProductService.getProductBaseByTitle(item.title).then(function (productBase) {

                if (JSON.stringify(productBase) == "[]") {

                    productBaseModel.createProductBase({
                        'title': item.title,
                        'description': item.description || "",
                        'image': item.image || "/no_image.jpg",
                        'platform': item.platform,

                    }).then(function () {

                        ProductService.getProductBaseByTitle(item.title).then(function (newProductBase) {

                            productVariantModel.createProductVariant({
                                'productBaseId': newProductBase[0].productBaseId,
                                'title': item.title,
                                'link': item.url,
                                'productShopId': item.id,
                                'price': item.price,
                                'currency': currency,
                                'availability': availability,
                                'shop': shop
                            });
                        })
                    });

                } else {
                    ProductService.getProductBaseByTitle(item.title).then(function (existProductBase) {
                        ProductService.getProductVariantByTitleAndShop(item.title, shop).then(function (productVariant) {
                            if (JSON.stringify(productVariant) == '[]') {

                                productVariantModel.createProductVariant({
                                    'productBaseId': existProductBase[0].productBaseId,
                                    'title': item.title,
                                    'link': item.url,
                                    'productShopId': item.id,
                                    'price': item.price,
                                    'currency': currency,
                                    'availability': availability,
                                    'shop': shop
                                });
                            } else {

                                productVariantModel.updateProductVariant({
                                    'productVariantId': productVariant[0].productVariantId,
                                    'productBaseId': productVariant[0].productBaseId,
                                    'title': item.title,
                                    'link': item.url,
                                    'productShopId': item.id,
                                    'price': item.price,
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
        return (data.length)
    },

    uploadProductsHRKGames: async (data, shop, currency) => {
        var quantityItems = data.length;
        do {
            let item = data[--quantityItems];
            let availability;
            if (item.stock > 0)
                availability = true;
            else (availability = false)

            ProductService.getProductBaseByTitle(item.title).then(function (productBase) {

                if (JSON.stringify(productBase) == "[]") {

                    productBaseModel.createProductBase({
                        'title': item.title,
                        'description': item.description || "",
                        'image': "/no_image.jpg",
                        'platform': item.platform,

                    }).then(function () {

                        ProductService.getProductBaseByTitle(item.title).then(function (newProductBase) {

                            productVariantModel.createProductVariant({
                                'productBaseId': newProductBase[0].productBaseId,
                                'title': item.title,
                                'link': item.url,
                                'productShopId': item.id,
                                'price': item.price,
                                'currency': currency,
                                'availability': availability,
                                'shop': shop
                            });
                        })
                    });

                } else {
                    ProductService.getProductBaseByTitle(item.title).then(function (existProductBase) {
                        ProductService.getProductVariantByTitleAndShop(item.title, shop).then(function (productVariant) {
                            if (JSON.stringify(productVariant) == '[]') {

                                productVariantModel.createProductVariant({
                                    'productBaseId': existProductBase[0].productBaseId,
                                    'title': item.title,
                                    'link': item.url,
                                    'productShopId': item.id,
                                    'price': item.price,
                                    'currency': currency,
                                    'availability': availability,
                                    'shop': shop
                                });
                            } else {

                                productVariantModel.updateProductVariant({
                                    'productVariantId': productVariant[0].productVariantId,
                                    'productBaseId': productVariant[0].productBaseId,
                                    'title': item.title,
                                    'link': item.url,
                                    'productShopId': item.id,
                                    'price': item.price,
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
        return(data.length)
    },

    uploadProductsEneba: async (data, shop, currency) => {
        var quantityItems = data.length;
        do {
            let item = data[--quantityItems];
            let priceWithCurrency = item.price._text;
            let price = (priceWithCurrency).substring(0, priceWithCurrency.length - 4);
    
            let availability;
            if (item.availability._text == 'in stock')
                availability = true;
            else (availability = false)
    
            ProductService.getProductBaseByTitle(item.title._text).then(function (productBase) {
                if(JSON.stringify(productBase) == "[]") {
    
                    productBaseModel.createProductBase({
                        'title': item.title._text,
                        'description': item.description._text,
                        'image': item.image_link._text || "/no_image.jpg",
                        'platform': item.brand._text,
    
                    }).then(function () {
    
                        ProductService.getProductBaseByTitle(item.title._text).then(function (newProductBase) {
    
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
    
                    ProductService.getProductBaseByTitle(item.title._text).then(function (existProductBase) {
                        ProductService.getProductVariantByTitleAndShop(item.title._text, shop).then(function (productVariant) {
                            if (JSON.stringify(productBase) == "[]") {
    
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
        return(data.length)
    }
}