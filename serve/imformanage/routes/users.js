var express = require('express');
var router = express.Router();
const db = require('../db/index');
const common = require('../common/index');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


// 登录功能(2021-6-12)
router.post('/login', function (req, res) {
  let { username, password } = req.body;
  let sql = 'select * from users where name = ?';
  db.query(sql, [username], function (err, result) {
    if (err) {
      console.log('登录时数据库出现错误:' + err);
      return
    } else {
      if (result.length == 0) {
        res.json({
          status: 201,
          msg: '账号不存在！'
        })
      } else if (result[0].password != password) {
        res.json({
          status: 201,
          msg: '密码错误！'
        })
      } else {
       
        let token = common.createToken(username);
        res.json({
          status: 200,
          msg: '登录成功！',
          token: token,
          id:result[0].id       
        })
      }
    }
  })


})
// 获取用户列表
router.get('/user', function (req, res) {
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
    sql = `select *,(select count(*) from users where name = '${query}') as count from users where name = '${query}'`;
    db.query(sql, null, function (err, result) {
      if (err) {
        console.log('搜索关键词时数据库出错' + err);
        return
      }
      // console.log(result);
      res.json(result)
    })
  }
  else {
    sql = 'select *,(select count(*) from users) as count from users limit ?,?';
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
// 根据id获取具体用户
router.get('/user/:id',function(req,res){
  let { id } = req.params;
  let sql = 'select * from users where id = ?';
  db.query(sql,[id],function(error,result){
    if(error){
      console.log('根据id获取具体用户时数据库出错:'+error);
    }else{
      // console.log(result);
      res.json(result);
    }
  })
})
// 更新用户状态
router.get('/state/:id/:state', function (req, res) {
  let { id, state } = req.params;
  console.log(id, state);
  if (state) {
    state = 0
  } else {
    state = 1
  }

  let sql = 'update users set state = ? where id = ?';
  db.query(sql, [state, id], function (err, result) {
    if (err) {
      console.log('更新状态时数据库出错' + err);
      return
    } else {
      if (result.affectedRows == 1) {
        res.send({
          status: 200,
          msg: '更新状态成功！'
        })
      } else {
        res.send({
          status: 201,
          msg: '更新状态失败！'
        })
      }
    }
  })

})
// 根据Id删除用户
router.get('/del/:id', function (req, res) {
  let { id } = req.params;
  let sql = 'delete  from users where id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log('根据id删除用户失败:' + err);
      return
    }
    if (result.affectedRows !== 1) {
      return res.send({ status: 201, msg: '删除该用户失败' })
    } else {
      return res.send({ status: 200, msg: '删除该用户成功' })
    }
  })
})
// 添加用户
router.post('/add', function (req, res) {
  let { name, password, email, duty } = req.body;
  let sql = `insert into users(name,password,email,duty) values(?,?,?,?)`;
  db.query(sql, [name, password, email, duty], (error, result) => {
    if (error) {
      console.log('添加用户时数据库出错' + error);
      return
    }
    if (result.affectedRows != 1) {
      return res.send(
        { status: 201, msg: '添加用户失败！' }
      )
    } else {
      return res.send(
        { status: 200, msg: '添加用户成功！' })
    }
  })
})
// 根据id获取对应用户列表
router.get('/update/:id', function (req, res) {
  let { id } = req.params;
  // console.log(id);
  let sql = 'select * from users where id=?';
  db.query(sql, [id], (error, result) => {
    if (error) {
      console.log('根据id获取对应用户列表数据库出错' + error);
      return
    }
    // console.log(result);
    res.json(result)
  })
})
// 根据对应id实现用户的编辑操作
router.post('/update/:id', function (req, res) {
  let { id, name, password, email, duty } = req.body;
  console.log(id, name, password, email, duty)
  let sql = 'update users set name=?,password=?,email=?,duty=? where id=?'
  db.query(sql, [name, password, email, duty, id], (error, result) => {
    if (error) {
      console.log('根据对应id实现用户的编辑时数据库出错' + error);
      return;
    } else {
      res.json(result)
    }
  })

})


module.exports = router;