var express = require('express');
var router = express.Router();
const db = require('../db/index');
const common = require('../common/index');


// 获取课程信息
router.get('/classes', function (req, res) {
    common.checkToken(req.headers['Authorization'])
    let query = req.query.query;
    let pagenum = Number(req.query.pagenum);
    let start, pagesize = Number(req.query.pagesize);
    if (pagenum == undefined) {
        pagenum = 1;
        start = 0;
    } else {
        start = (pagenum - 1) * pagesize;
    }
    let sql = '';
    if (query != '') {
        sql = `select *,(select count(*) from class where c_id like '%${query}%' and duty like '%电子系%') as count from class where c_id  like '%${query}%' and duty like '%电子系%' `;
        db.query(sql, null, function (err, result) {
            if (err) {
                console.log('搜索关键词时数据库出错' + err);
                return;
            }
            // console.log(result);
            res.json(result)
        })
    } else {
        sql = `select *,(select count(*) from class where duty like '%电子系%') as count from class where duty like '%电子系%'  limit ?,?`;
        db.query(sql, [start, pagesize], function (err, result) {
            if (err) {
                console.log('获取课程信息时数据库出错' + err);
                return
            } else {
                // console.log(result);
                res.json(result);
            }
        })
    }
})
// 根据id删除课程信息
router.get('/del', function (req, res) {
    let { id } = req.params;
    console.log(id);
    let sql = 'delete from class where c_id = ?';
    db.query(sql, [id], (error, result) => {
        if (error) {
            console.log('根据id删除课程信息时数据库出现错误' + error);
        }
        // console.log(result);
        res.json(result);
    })
})




module.exports = router;