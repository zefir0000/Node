const axios = require('axios')
const fs = require('fs')

const ProductController = require('../controllers/ProductController')

module.exports = {
    getFileFromCDKeys: () => {
        axios.get(`https://adm.cdkeys.com/feeds/cdkeys_affiliate_feed_eur.txt`, {
            authority: "adm.cdkeys.com"
        }).then((response) => {
            new Promise(function (resolve, reject) {

                let uploadPath = 'uploading/' + new Date + "-" + "cdkeys_eur.txt";
                fs.writeFile(uploadPath, response.data, (err) => {
                    if (err) throw err;
                    resolve(uploadPath)
                })
            }).then((uploadPath) => {
                ProductController.uploadProductsCDkeys(uploadPath, { currency: 'EUR', market: 'cdkeys.com' });
            })

        })
    },

    getFileFromHRKGames: () => {
        axios.get(`https://www.hrkgame.com/en/hotdeals/cvs-feed/?key=F546F-DFRWE-DS3FV&cur=EUR`).then((response) => {
            new Promise(function (resolve, reject) {

                let uploadPath = 'uploading/' + new Date + "-" + "hrkgames_eur.csv";
                fs.writeFile(uploadPath, response.data, (err) => {
                    if (err) throw err;
                    console.log('Saved!');
                    resolve(uploadPath)
                })
            }).then((uploadPath) => {
                ProductController.uploadProductsHRK(uploadPath, { currency: 'EUR', market: 'HRK Games' });
            });
        })
    },

    getFileFromEneba: () => {
        axios.get(`https://www.eneba.com/rss/products.xml`).then((response) => {

            new Promise(function (resolve, reject) {
                let uploadPath = 'uploading/' + new Date + "-" + "eneba_eur.xml";
                fs.writeFile(uploadPath, response.data, function (err) {
                    if (err) throw err;
                    console.log('Saved!');
                    resolve(uploadPath)
                })
            }).then((uploadPath) => {
                ProductController.uploadProductsEneba(uploadPath, { currency: 'EUR', market: 'Eneba' });
            });
        })
    },
}