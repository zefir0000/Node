const bookshelf = require('../config/bookshelf');

const UploadFile = bookshelf.Model.extend({
    tableName: 'uploadFile'
});
const UploadMemFile = bookshelf.Model.extend({
    tableName: 'Mems'
});

module.exports.uploadFile = (uploadFile) => {

    return new UploadFile({
        name: uploadFile.name,
        mimetype: uploadFile.mimetype,

    }).save(null, { method: 'insert' }).then(function () {
        console.log('Upload file ', uploadFile.name);
    }).catch((err) => {
        console.log('Upload file: ', uploadFile.name, ' somthing went wrong!: ', err)
    });
};

module.exports.uploadMemFile = (uploadFile) => {
    createDate = new Date(Date.now()).toLocaleString();

    return new UploadMemFile({
        patchFile: uploadFile.patchFile,
        mimetype: uploadFile.mimetype,
        createdDate: createDate,

    }).save(null, { method: 'insert' }).then(function () {
        console.log('Upload file ', uploadFile.name);
    }).catch((err) => {
        console.log('Upload file: ', uploadFile.name, ' somthing went wrong!: ', err)
    });
};


