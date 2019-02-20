const { check, validationResult } = require('express-validator/check');
const UploadFile = require('../models/uploadfile');
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
            });

        quantityPages--;
    } while (quantityPages > 0)

req.flash('form','Product uploading!');
res.redirect('upload/');
    
};

exports.trustpilot = (req, res, next) => { // zaimplementowac pobieranie po nazwie marketu 

    axios.get('https://trustpilot.com/review/g2a.com')
            .then(response => {

            var products = response.data;
            var begin = products.indexOf('<script type="application/ld+json" data-business-unit-json-ld>')
            var string = (products.substring(begin + 62));
            var end = string.indexOf('</script>');
            var final = string.substring(0,end);
            // return zwrotki wraz z jej wyslaniem do bazy danych wraz z id marketu
                console.log(end)
                console.log(final)
          
            });
};

exports.uploadMems = (req, res, next) => {

    let sampleFile = req.files.sampleFile;
    let patch = 'uploadMems/' + new Date + "-" + sampleFile.name
    let uploadPath = 'public/' + patch;

    sampleFile.mv(uploadPath, function(err) {
        if (err)
        return next();

        // upload info about file to DB
        UploadFile.uploadMemFile({
            'name': sampleFile.name,
            'patchFile': patch,
            'mimetype': sampleFile.mimetype
        });
    });

req.flash('form', sampleFile.name, ', mem uploaded!');
res.redirect('mems');
};

exports.validationMemFile = (req, res, next) => {

if (Object.keys(req.files).length == 0) {
    res.status(400);
    req.flash('form', 'File not exist');
    return res.redirect('mems/');
}
var mime = req.files.sampleFile.mimetype;
if (!(mime === "image/jpeg" || mime === "image/png"|| mime === "image/gif"|| mime === "image/x-ms-bmp")) {
    res.status(400);
    req.flash('form', req.files.sampleFile.name + ' is not image file (jpg/jepg/bmp/png/gif)');
    return res.redirect('mems/');
}
next();
};
