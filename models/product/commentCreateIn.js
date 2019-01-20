const bookshelf = require('../config/bookshelf');

const ProductComment = bookshelf.Model.extend({
    tableName: 'ProductComments'
});

module.exports.createProductComment = (productComment) => {
   
    return new ProductComment({
        id: product.id,        
        // commentId: productComment.commentId,
        commentParentId: productComment.commentParentId,
        description: productComment.description,
        rating: productComment.rating,
        platform: productComment.platform,
        userId: productComment.userId
        }).save(null, { method: "insert"})
        .catch((err) => { console.log(err); err.status(400); return err });
};

module.exports.updateProductComment = (productComment) => {
   
    return new ProductComment({
        //id: product.id,        
        //commentId: productComment.commentId,
        commentParentId: productComment.commentParentId,
        description: productComment.description,
        rating: productComment.rating,
        platform: productComment.platform,
        //userId
        }).save(null, { method: "update"})
        .catch((err) => { console.log(err); err.status(400); return err });
};
