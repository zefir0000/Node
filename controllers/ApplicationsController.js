const { check, validationResult } = require('express-validator/check');
const UploadFile = require('../models/uploadfile');
const UploadToDB = require('./UploadToDB');
const Request = require('request');

function getProductsFromG2(error, response, body) {
    if (!error && response.statusCode == 200) {
      const info = JSON.parse(body);
      console.log('info', info);
      console.log('body', body)
      console.log(info.stargazers_count + " Stars");
      console.log(info.forks_count + " Forks");
    }
  }
  

exports.upload = (req, res, next) => {

        let sampleFile = req.files.sampleFile;
        let uploadPath = 'uploading/' + new Date + "-" + sampleFile.name;

        sampleFile.mv(uploadPath, function(err) {
            if (err)
            return next();
            // upload products to DB
            UploadToDB.uploadProducts(uploadPath);

            // upload info about file to DB
            UploadFile.uploadFile
({
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



exports.uploadProductsFromG2 = (req, res, next) => {
    var fullPayload;
    var page = 1;
    do {

    var options = {
        url: 'https://api.g2a-test.com/v1/products?page=', page,
        headers: {
          'Autorization': 'YVIiPPKwAkqzMLtF, 9cef38b30909ad6be27ed2a3a65cf3f01a72193aa457e65b3d4e420e065ab395'
        }
      };

        var payload = JSON.parser(Request(options, getProductsFromG2)).docs;
        console.log('payload: ', payload);
        fullPayload = fullPayload + payload;
        page = page + 1;
    } while ((payload != "[]"));


    let sampleFileName = "marketG2"
    let uploadPath = 'uploading/' + new Date + "-" + sampleFileName;
    fs.writeFile("/uploading/", fullPayload, function(err) {
        if(err) {
            return console.log(err);
        }

            console.log("The file was saved!");
        }); 

    sampleFile.mv(uploadPath, function(err) {
        if (err)
        return next();
        // upload products to DB
        UploadToDB.uploadProductsFromG2ToDB(fullPayload);

        // upload info about file to DB
        UploadFile.uploadFile({
            'name': sampleFileName,
            'mimetype': 'JSON'
        });
    });

req.flash('form','ProductsForm ', sampleFileName, ', file uploaded!');
res.redirect('upload/');
    
};