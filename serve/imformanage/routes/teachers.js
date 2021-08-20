var express = require('express');
var router = express.Router();
const db = require('../db/index')
const multer = require('multer');
const fs = require('fs');
const moment = require('moment')
const path = require('path');
const common = require('../common/index');
// 获取所有教师
router.get('/teacher', function (req, res) {
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
        sql = `select *,(select count(*) from teachers where name = '${query}') as count from teachers where name = '${query}'`;
        db.query(sql, null, function (err, result) {
            if (err) {
                console.log('搜索关键词时数据库出错' + err);
                return
            }
            // console.log(result);
            res.json(result)
        })
    } else {
        sql = 'select *,(select count(*) from teachers) as count from teachers limit ?,?';
        db.query(sql, [start, pagesize], function (err, result) {
            if (err) {
                console.log('获取所有教师信息时数据库出错' + err);
                return
            } else {
                // console.log(result);
                res.json(result)
            }
        })
    }
})
// 根据id删除教师
router.get('/del/:id', function (req, res) {
    let { id } = req.params;
    let sql = 'delete from teachers where id = ?';
    db.query(sql, [id], (error, result) => {
        if (error) {
            console.log('根据学号删除对应的教师时数据库出错:' + error);
            return;
        } else {
            res.send(result)
        }
    })
})
// 根据id编辑教师
router.get('/update/:id', function (req, res) {
    let { id } = req.params;
    let sql = 'select * from teachers where id = ?';
    db.query(sql, [id], (error, result) => {
        if (error) {
            console.log('编辑对应的教师时数据库出错' + error);
            return
        } else {
            // console.log(result);
            res.send(result)
        }
    })

})

let uploadDir = `./static/upload/${moment().format('YYYYMMDD')}`
fs.mkdirSync(uploadDir, {
    recursive: true
})   //创建上传的文件夹

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})  //配置本地存储并对上传文件重命名

let upload = multer({
    storage: storage
}).any('pic')  //上传表单的name属性的值

// 编辑提交
router.post('/update/:id', function (req, res) {

    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            return;
        } else {
            let imgPath = [];
            if (!req.files) {
                console.log('no');
                return;
            }
            req.files.forEach(function (i) {
                imgPath.push((i.path).replace('static\\', ''))
            })// [a,b]  a,b    /images/a.jpg    /css/a.css
            //imgPath=imgPath.toString();
            let id = req.body.id;
            let name = req.body.name;
            let mobile = req.body.mobile;
            let summary = req.body.summary;
            let sql = 'update  teachers  set name=?,picURL=?,summary=?,mobile=? where id=?';
            db.query(sql, [name, imgPath, summary, mobile, id], function (err, result) {
                if (err) {
                    console.log('编辑提交时数据库出现错误' + err);
                    return
                } else {
                    res.send(result)
                }
            })
        }
    })
})



module.exports = router