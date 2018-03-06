var models = require('../db');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('../sqlMap');

//连接数据库
var conn = mysql.createConnection(models.mysql);
conn.connect();

router.post('/getMySearch',function( request, response){
    var word = '%'+request.body.word+'%';
    var queryMyWord = $sql.serachWord.query_my_word;
    conn.query(queryMyWord,word,function( err, res){
        if(err){
            console.log(err);
        }
        else if(res[0]!==undefined){
            response.send(res);               //数据库中存在该关键字对应的记录
        }else{
            response.send('-1');               //数据库中不存在该关键字对应的记录
        }
    });
});


module.exports = router;
