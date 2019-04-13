const { check, validationResult } = require('express-validator/check');
const UploadFile = require('../models/uploadfile');
const ProductController = require('./ProductController');
const dbConfig = require('../config/dbConfig')
const UploadFileService = require('../services/UploadFileService')
const knex = require('knex')(dbConfig);
const axios = require('axios');
const fs = require('fs');

const trustpilot = require('../services/TrustpilotService')

// uploading products file 

exports.uploadPage = (req, res) => {
    knex.from('Market')
        .then(function (markets) {
            res.statusCode = 200;
            res.render('pages/upload', {
                markets,
                formMessage: req.flash('form')
            })
        });
};

exports.upload = (req, res, next) => {
    // console.log(req.body)

    // let sampleFile = req.files.sampleFile;
    // let uploadPath = 'uploading/' + new Date + "-" + sampleFile.name;

    // sampleFile.mv(uploadPath, function (err) {
        switch (req.body.market) {
            case "G2A.com":
                //uploadProductsFromG2A()
                break;

            case "Eneba":
            axios.get(`https://www.eneba.com/rss/products.xml`).then((response) => {
                    
                // new Promise((resolve, reject) => {
                //     let date = 123
                //     let uploadPath = 'uploading/' + date + "-" + "eneba_eur.xml";
                //     console.log(uploadPath, 'uploadpath')
                    // fs.writeFile(uploadPath, response.data, () => {
                    //     console.log('Saved!');
                    //     resolve(uploadPath)
                    // })}).then((uploadPath) => {
                        ProductController.uploadProductsEneba(response.data, req.body);
                   // });
                })
                break;

            case "HRK Games":
            axios.get(`https://www.hrkgame.com/en/hotdeals/cvs-feed/?key=F546F-DFRWE-DS3FV&cur=EUR`, {
                    //authority: "adm.cdkeys.com"
                }).then((response) => {
                    let uploadPath = 'uploading/' + '1233' + "-" + "hrkgames_eur";
                    fs.writeFile(uploadPath, response.data, function () {
                        console.log('Saved!');
                    });
                    ProductController.uploadProductsHRK(uploadPath, req.body);
                })
                break;

            case "cdkeys.com":
                axios.get(`https://adm.cdkeys.com/feeds/cdkeys_affiliate_feed_eur.txt`, {
                    authority: "adm.cdkeys.com"
                }).then((response) => {
                    let uploadPath = 'uploading/cdkeys_eur';
                    fs.writeFile(uploadPath, response.data, function (err) {
                        if (err) throw err;
                        console.log('Saved!');
                    });
                    ProductController.uploadProductsCDkeys(uploadPath, req.body);
                })

                break;
        }

        // if (err) {
        //     console.log('err', err);
        //     return next();
        // }

        // upload info about file to DB
        // UploadFile.uploadFile({
        //     'name': req.files.sampleFile.name,
        //     'mimetype': req.files.sampleFile.mimetype
        // });
    

    //req.flash('form', sampleFile.name, ', file uploaded!');
    res.redirect('upload/');
};

exports.validationUploadFile = (req, res, next) => {

    if (Object.keys(req.files).length == 0) {
        res.status(400);
        req.flash('form', 'File not exist');
        return res.redirect('upload/');
    }

    if (req.files.sampleFile.mimetype !== 'text/xml'
        && req.files.sampleFile.mimetype !== 'application/vnd.ms-excel'
        && req.files.sampleFile.mimetype !== 'text/csv'
        && req.files.sampleFile.mimetype !== 'text/txt') {
        res.status(400);
        req.flash('form', req.files.sampleFile.name + ' is not xml/csv/txt file ');
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
            })

        quantityPages--;
    } while (quantityPages > 0)

    req.flash('form', 'Product uploading!');
    res.redirect('upload/');

};

// uploading mems file 
exports.memsPage = (req, res) => {
    knex.from('Mems')
        .then(function (mems) {
            res.statusCode = 200;
            res.render('pages/mem', {
                mems,
                formMessage: req.flash('form')
            })
        });
};

exports.uploadMems = (req, res, next) => {

    let sampleFile = req.files.sampleFile;
    let patch = ('uploadMems/' + sampleFile.name).replace(/ /g, "-")
    let uploadPath = 'public/' + patch;
    sampleFile.mv(uploadPath, function (err) {
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
    if (!(mime === "image/jpeg" || mime === "image/png" || mime === "image/gif" || mime === "image/x-ms-bmp")) {
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

// inne smieci
exports.trustpilot = (req, res, next) => {

    trustpilot.updateTrustpilot()
};
