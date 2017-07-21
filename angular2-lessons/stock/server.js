var express = require('express')
var path = require('path')
// var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var https = require('https')
var index = require('./routes/index')
var stock = require('./routes/stock')
var schedule = require("node-schedule")
var csv = require('csv')

var router = express.Router();
var mysql = require('mysql');
var dbConfig = require('./db/DBConfig');
var stockSQL = require('./db/stockSQL');
// 使用DBConfig.js的配置信息创建一个MySQL连接池
var pool = mysql.createPool(dbConfig.mysql);
var app = express()

//view engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile)
app.use(express.static(path.join(__dirname, 'client')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    entended: false
}))

app.use('/', stock)

app.listen(3000, function () {
    console.log('Server started on port 3000...')

})
// var rule = new schedule.RecurrenceRule();
// var times = [1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51, 56];
// rule.minute = times;
// schedule.scheduleJob(rule, function () {
//     getStock()
// })

getStock()

function getStock() {
    var url = 'https://chartapi.finance.yahoo.com/instrument/1.0/GOOG/chartdata;type=quote;range=1d/json';
    https.get(url, function (res) {
        var body = '';
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {
            var res;
            var index = body.indexOf('series') + 10
            var json = body.slice(index, -3)
            res = JSON.parse(json)
            var test = res[0];
            console.log(typeof test.close)
            pool.getConnection(function (err, connection) {
                connection.query(stockSQL.insert, ["yisheng", test.Timestamp, test.high, test.low, test.open, test.close, test.volume], function (err, result) {
                    if (result) {
                        console.log('store success')
                    } else {
                        console.log('store error')
                    }
                    connection.release()
                })
            })
        })
    }).on('error', function (e) {
        console.log('Got an error:', e)
    })

}