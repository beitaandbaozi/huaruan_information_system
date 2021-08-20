var express = require('express');
var router = express.Router();
const db = require('../db/index');

// 发布消息
router.post('/message', function (req, res) {
    let { title, author, time, content } = req.body;
    let sql = 'insert into message(title,author,publishTime,content) values(?,?,?,?)'
    db.query(sql, [title, author, time, content], (error, result) => {
        if (error) {
            console.log('添加公告时数据库出现错误' + error);
        }
        res.json(result)
    })
})
// 获取文章信息
router.get('/message', function (req, res) {
    let sql = 'select * from message';
    db.query(sql, null, (error, result) => {
        if (error) {
            console.log('获取文章信息时数据库出错' + error)
        }
        res.json(result)
    })
})


module.exports = router;