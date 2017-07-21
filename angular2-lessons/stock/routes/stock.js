var express = require('express');
var router = express.Router();
// 导入MySQL模块
var mysql = require('mysql');
var dbConfig = require('../db/DBConfig');
var stockSQL = require('../db/stockSQL');
// 使用DBConfig.js的配置信息创建一个MySQL连接池
var pool = mysql.createPool(dbConfig.mysql);
// 响应一个JSON数据
var responseJSON = function (res, ret) {
    if (typeof ret === 'undefined') {
        res.json({
            code: '-200',
            msg: 'failed'
        });
    } else {
        res.json(ret);
    }
};
// 添加用户
router.get('/', function (req, res, next) {
    // 从连接池获取连接 
    pool.getConnection(function (err, connection) {
        // 获取前台页面传过来的参数  
        var param = req.query || req.params;
        var queryAll = connection.query(stockSQL.queryAll, function (err, result) {
            connection.release();
            responseJSON(res, result)
        });
    });
});
module.exports = router;