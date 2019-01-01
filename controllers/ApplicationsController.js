const Application = require('../models/application');
const { check, validationResult } = require('express-validator/check');
const UploadFile = require('../models/uploadfile')
const ProductSimple = require('../models/productSimple')
const convertXmlToJson = require('xml-js');


exports.store = async (req, res, next) => {
    await Application.create({
        'name': req.body.name,
        'phone': req.body.phone,
        'message': req.body.message
    });

    req.flash('form', req.body.first_name + ', you are a true hero!');
    res.redirect('/');
};

exports.validate = [
    check('name').trim().isLength({ min: 1 }).withMessage('Name is required.'),
    check('phone').isLength({ min: 1 }).withMessage('Phone is required.'),
    check('message').isLength({ min: 1 }).withMessage('Message is required')
];

exports.checkValidation = (req, res, next) => {
    const errors = validationResult(req);
    if ( ! errors.isEmpty()) {
        return res.render('home', {
            validated: req.body,
            errors: errors.mapped(),
            showLightbox: 'true'
        });
    }
    next();
};

exports.normalizeData = (req, res, next) => {
    const nameArr = req.body.name.split(' ');

    req.body.first_name = nameArr.shift();
    req.body.last_name = nameArr.join();

    next();
};

exports.upload = (req, res, next) => {
    console.log('req.files >>>', req.files);

        let sampleFile = req.files.sampleFile;
        let uploadPath = 'uploading/' + new Date + "-" + sampleFile.name;

        sampleFile.mv(uploadPath, function(err) {
            if (err)
            return next();

            // convert xml to json
            var xml = require('fs').readFileSync(uploadPath, 'utf8');           
            var result1 = convertXmlToJson.xml2json(xml, {compact: true, spaces: 4});

            //console.log('result 1:', '\n', result1, '\n');
            let rss = result1.rss
            console.log('moj element','\n',result1.rss);

    

            // upload info about file to DB
            UploadFile.uploadFileXML({
                'name': req.files.sampleFile.name,
                'mimetype': req.files.sampleFile.mimetype
            });
        });
    req.flash('form', sampleFile.name + ', file uploaded!');
    res.redirect('upload/');
};

exports.existFile = (req, res, next) => {

    if (Object.keys(req.files).length == 0) {
        res.status(400);
        req.flash('form', 'File not exist');
        return res.redirect('upload/');
    }
    next();
};
exports.validationTypeFile = (req, res, next) => {
    if (req.files.sampleFile.mimetype !== 'text/xml') {
        res.status(400);
        req.flash('form', req.files.sampleFile.name + ' is not xml file');
        return res.redirect('upload/');
    }
    next();


}