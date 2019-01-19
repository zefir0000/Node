const { check, validationResult } = require('express-validator/check');
const UploadFile = require('../models/uploadfile');
const UploadToDB = require('./UploadToDB');
const ProductController = require('./ProductController');

const axios = require('axios');
const fs = require('fs');


exports.upload = (req, res, next) => {

        let sampleFile = req.files.sampleFile;
        let uploadPath = 'uploading/' + new Date + "-" + sampleFile.name;

        sampleFile.mv(uploadPath, function(err) {
            if (err)
            return next();
            // upload products to DB
            ProductController.uploadProducts(uploadPath);

            // upload info about file to DB
            UploadFile.uploadFile({
                'name': req.files.sampleFile.name,
                'mimetype': req.files.sampleFile.mimetype
            });
        });

    req.flash('form', sampleFile.name, ', file uploaded!');
    res.redirect('upload/');
};

exports.validationUploadFile = (req, res, next) => {

    if (Object.keys(req.files).length == 0) {
        res.status(400);
        req.flash('form', 'File not exist');
        return res.redirect('upload/');
    }
    
    if (req.files.sampleFile.mimetype !== 'text/xml') {
        res.status(400);
        req.flash('form', req.files.sampleFile.name + ' is not xml file');
        return res.redirect('upload/');
    }
    next();
};


exports.uploadProductsFromG2A = (req, res, next) => {

    const g2aProducts = axios.create({
        headers: {
            'Authorization': 'qdaiciDiyMaTjxMt, 74026b3dc2c6db6a30a73e71cdb138b1e1b5eb7a97ced46689e2d28db1050875'
        }
    })
    var quantityPages = 6;

    do {
          g2aProducts.get('https://sandboxapi.g2a.com/v1/products?page=' + quantityPages)
            .then(response => {

            var products = response.data.docs;

            UploadToDB.uploadProductsFromG2AToDB(products)
          
            console.log(products[0].id)
            });

        quantityPages--;

    } while (quantityPages > 0)

req.flash('form','Product uploading!');
res.redirect('upload/');
    
};