const bookshelf = require('../config/bookshelf');

const UploadFile = bookshelf.Model.extend({
    tableName: 'uploadFile'
});

module.exports.uploadFileXML = (uploadFile) => {
    return new UploadFile({

        name: uploadFile.name,
        mimetype: uploadFile.mimetype,
    }).save(null, { method: 'insert'}).then(function(){
        console.log('Upload file ', uploadFile.name);        
    })
    .catch((err) => { 
        console.log('Upload file: ', uploadFile.name, ' somthing went wrong!: ', err )
    });
};

        
