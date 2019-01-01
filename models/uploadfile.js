const bookshelf = require('../config/bookshelf');

const UploadFile = bookshelf.Model.extend({
    tableName: 'uploadFile'
});

module.exports.uploadFileXML = (uploadFile) => {
    return new UploadFile({

        name: uploadFile.name,
        mimetype: uploadFile.mimetype,
})};
        
