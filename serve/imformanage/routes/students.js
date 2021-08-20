var express = require('express');
var router = express.Router();
const db = require('../db/index');
const common = require('../common/index');


// 获取所有学生数据
router.get('/student', function (req, res) {
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
        sql = `select *,(select count(*) from students where num = '${query}') as count from students where num = '${query}'`;
        db.query(sql, null, function (err, result) {
            if (err) {
                console.log('搜索关键词时数据库出错' + err);
                return
            }
            // console.log(result);
            res.json(result)
        })
    } else {
        sql = 'select *,(select count(*) from students) as count from students limit ?,?';
        db.query(sql, [start, pagesize], function (err, result) {
            if (err) {
                console.log(err);
                return
            } else {
                // console.log(result);
                res.json(result)
            }
        })
    }
})
// 添加学生操作
router.post('/add', function (req, res) {
    let { num, name, classNum, mobile, teacher, duty } = req.body;
    let sql = 'insert into students(num,name,class,mobile,teacher,duty)values(?,?,?,?,?,?)';
    db.query(sql, [num, name, classNum, mobile, teacher, duty], (error, result) => {
        if (error) {
            console.log('添加学生时,数据库出现错误!' + error);
            return;
        } else {
            res.send(result)
        }

    })
})
// 根据学号删除对应的学生
router.get('/del/:id', function (req, res) {
    let { id } = req.params;
    let sql = 'delete from students where num = ?';
    db.query(sql, [id], (error, result) => {
        if (error) {
            console.log('根据学号删除对应的学生时数据库出错:' + error);
            return;
        } else {
            res.send(result)
        }
    })
})
// 根据学号编辑对应的学生
router.get('/update/:id', function (req, res) {
    let { id } = req.params;
    let sql = 'select * from students where num = ?';
    db.query(sql, [id], (error, result) => {
        if (error) {
            console.log('根据学号编辑对应的学生时数据库出错' + error);
            return
        } else {
            // console.log(result);
            res.send(result)
        }

    })

})

// 根据学号编辑对应的学生提交
router.post('/update/:id', function (req, res) {
    let { num, name, classNum, mobile, teacher, duty } = req.body;
    let sql = 'update students set name=?,class=?,mobile=?,teacher=?,duty=? where num=?';
    db.query(sql, [name, classNum, mobile, teacher, duty, num], (error, result) => {
        if (error) {
            console.log('根据学号编辑对应的学生提交时数据库出现错误' + error);
            return;
        } else {
            res.send(result);
        }

    })


})



module.exports = router;
