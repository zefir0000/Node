const { check, validationResult } = require('express-validator/check');
const UploadFile = require('../models/uploadfile');
const ProductController = require('./ProductController');
const dbConfig = require('../config/dbConfig')
const UploadToDB = require('./UploadToDB')
const knex = require('knex')(dbConfig);
const axios = require('axios');
const fs = require('fs');

exports.upload = (req, res, next) => {
    console.log('1')

        let sampleFile = req.files.sampleFile;
        let uploadPath = 'uploading/' + new Date + "-" + sampleFile.name;

        sampleFile.mv(uploadPath, function(err) {
            console.log('2', uploadPath)

            if (err){
                console.log('err', err);
                return next();
            }
            // upload products to DB
            if(req.files.sampleFile.mimetype === 'text/xml'){
                ProductController.uploadProducts(uploadPath);
                console.log('3')

            } else if(req.files.sampleFile.mimetype !== 'application/vnd.ms-excel') {
                console.log('4')

                ProductController.uploadProductsFromCSV(uploadPath);
            } else {
                console.log('ERROR Something went wrong')
            }

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
    
    if (req.files.sampleFile.mimetype !== 'text/xml' && req.files.sampleFile.mimetype !== 'application/vnd.ms-excel') {

        res.status(400);
        req.flash('form', req.files.sampleFile.name + ' is not xml/csv file ');
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
            ProductController.uploadProductsFromG2AToDB(products)
            });

        quantityPages--;
    } while (quantityPages > 0)

req.flash('form','Product uploading!');
res.redirect('upload/');
    
};

exports.trustpilot = (req, res, next) => {

    axios.get('https://trustpilot.com/review/eneba.com')
        .then(response => {

        var products = response.data;
        var begin = products.indexOf('<script type="application/ld+json" data-business-unit-json-ld>')
        var string = (products.substring(begin + 62));
        var end = string.indexOf('</script>');
        var final = string.substring(0,end - 10);
            console.log(JSON.parse(final))
            res.json(JSON.parse(final))

            }).catch((err) => { 
                console.log( err )})
};

exports.uploadMems = (req, res, next) => {

    let sampleFile = req.files.sampleFile;
    let patch = ('uploadMems/' + sampleFile.name).replace(/ /g, "-")
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
    return res.redirect('mems');
}
var mime = req.files.sampleFile.mimetype;
if (!(mime === "image/jpeg" || mime === "image/png"|| mime === "image/gif"|| mime === "image/x-ms-bmp")) {
    res.status(400);
    req.flash('form', req.files.sampleFile.name + ' is not image file (jpg/jepg/bmp/png/gif)');
    return res.redirect('mems');
}
next();
};

exports.deleteMem = (req, res) => {
    knex.from('Mems')
        .where('memId', req.params.memId)
        .then(function (mems) {
            path = 'public/' + mems[0].patchFile
            console.log(path)
            fs.unlink(Buffer.from(path), (err) => {
                if (err) {
                console.log('fail deleted ', mems[0].patchFile, err)
            } else { console.log('successfully deleted ', mems[0].patchFile) }
              });

            res.statusCode = 204;
            knex.from('Mems')
                .where('memId', req.params.memId)
                .del()
                .then(function () {
                    res.statusCode = 204;
                    req.flash('Deleted Mem with id: ', req.params.memId, ' succeed!');
                    res.redirect('../mems')
                });
        });
};
