const express = require('express');
const dotenv = require('dotenv')
dotenv.config()

const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const basicAuth = require("./middlewares/basicAuth");
const flash = require('connect-flash');
const routes = require('./routes/index');
const errorsHandler = require('./middlewares/errors');
const fileUpload = require('express-fileupload');
const cors = require('cors')
const cron = require('node-cron')
const UploadFileService = require('./services/UploadFileService')
const TrustpilotService = require('./services/TrustpilotService')

const app = express();


app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))

// Access the session as req.session
app.get('/', function(req, res, next) {
  if (req.session.views) {
    req.session.views++
    res.setHeader('Content-Type', 'text/html')
    res.write('<p>views: ' + req.session.views + '</p>')
    res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
    res.end()
  } else {
    req.session.views = 1
    res.end('welcome to the session demo. refresh!')
  }
})



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(session({
//     secret: 'secret',
//     resave: false,
//     saveUninitialized: true,
//     cookie: {}
// }));
app.use(basicAuth)

app.use(flash());
app.use(fileUpload());

app.use('/', routes);
cron.schedule('30 6 * * *', () => {
    UploadFileService.getFileFromCDKeys()
    var updateDate = new Date(Date.now()).toLocaleString();
    console.log('Products from cdKeys updated on time: ', updateDate);
});
cron.schedule('35 6 * * *', () => {
    UploadFileService.getFileFromHRKGames()
    var updateDate = new Date(Date.now()).toLocaleString();
    console.log('Products from HRKGames updated on time: ', updateDate);
});
cron.schedule('40 6 * * *', () => {
    UploadFileService.getFileFromEneba()
    var updateDate = new Date(Date.now()).toLocaleString();
    console.log('Products from Eneba updated on time: ', updateDate);
});
cron.schedule('45 6 * * *', () => {
    TrustpilotService.updateTrustpilot()
    var updateDate = new Date(Date.now()).toLocaleString();
    console.log('Updated trustpilot raiting for markets on time: ', updateDate);
});


app.use(errorsHandler.notFound);
app.use(errorsHandler.catchErrors);

module.exports = app;