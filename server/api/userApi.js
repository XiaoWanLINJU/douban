var models = require('../db');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('../sqlMap');
var session = require('express-session');
var cookieParser = require('cookie-parser');

router.use(cookieParser());
router.use(session({
    secret:'123456',
    resave: true,
    saveUninitialized:false
    })
);

//连接数据库
var conn = mysql.createConnection(models.mysql);
conn.connect();

//查询用户接口
router.post('/queryUser',(request,response) => {
    var body = request.body;
    var queryUser = $sql.user.query_user;
    conn.query(queryUser,body.username, function( err , result ){
        if(err){
            console.log(err);            //数据库操作失败
        }
        if(result[0]===undefined){
            response.send('-1');             //查询不到该用户名
        }else{
            if(result[0].password!==body.password){
                response.send('0');          //密码错误
            }else{
                request.session.sessionUserName = body.username;
                request.session.sessionUserId = result[0].userid;
                response.send('1');          //查询到该用户，登陆成功
            }
        }
    });
});

//新建用户接口
router.post('/addUser',( request , response ) => {
    var body = request.body;
    var addUser = $sql.user.add;
    var query_user = $sql.user.query_user;
    conn.query(query_user, body.username,function( err , result){
        if(err){
            console.log(err);
        }
        if(result[0]===undefined){
            conn.query(addUser,[body.username,body.password],function( erradd , res){
                if(erradd){
                    console.log(erradd);
                }
                if(res){
                    request.session.sessionUserId = res.insertId;
                    request.session.sessionUserName = body.username;
                    response.send('1');             //插入成功
                }
            });
        }else{
            response.send('0');                  //用户已存在，插入失败
        }
    });
});


router.get('/getSessionName', function(request,response){
    
    var sessionName = request.session.sessionUserName;
    var sessionId = request.session.sessionUserId;
    if(sessionName&&sessionId){
        var sessionUser = {sessionname:sessionName,sessionid:sessionId};
        response.send(sessionUser);          //该用户已登陆
        
    }else{
        response.send('-1');                 //该用户未登陆
    }
});

router.post('/logout',function( request, response){
    request.session.sessionUserId = null;
    request.sessionUserName = null;
    response.send('1');
});


module.exports = router;
