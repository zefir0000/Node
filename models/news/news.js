const bookshelf = require('../../config/bookshelf');

const News = bookshelf.Model.extend({
    tableName: 'News'
});

module.exports.createNews = (news) => {
    console.log('model', news)

    var createDate = new Date(Date.now()).toLocaleString();
    return new News({
        title: news.title,
        imageLink: news.imageLink,
        likes: news.likes,
        unlikes: news.unlikes,
        news: news.news,
        createdDate: createDate

    }).save(null, { method: 'insert' }).then(function () {
        console.log('Added news with title: ', news.title);
    })
        .catch((err) => {
            console.log('Added news: ', news.title, ' somthing went wrong!: ', err)
        });
}
module.exports.updateNews = (news) => {
    console.log('news', news)
    updateDate = new Date(Date.now()).toLocaleString();

    return new News({
        title: news.title,
        imageLink: news.imageLink,
        likes: news.likes,
        unlikes: news.unlikes,
        news: news.news,
        updatedDate: updateDate
    }).where('newsId', news.newsId)
        .save(null, { method: "update" }, { patch: true })
        .catch((err) => { console.log(err); return err });
};
