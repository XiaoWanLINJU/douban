
var models = require('../db');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('../sqlMap');
var moment = require('moment');

//连接数据库
var conn = mysql.createConnection(models.mysql);
conn.connect();


//获取首页电影列表接口
router.get('/getMovieFew',function(request,response){
    var queryMovieFew = $sql.film.query_few_movie;                //查询电影类最后即最新的4条数据
    conn.query(queryMovieFew,function( err , result ){
        if(err){
            console.log(err);
        }
        if(result){                                              
            response.send(result);
        }
    });   
});

//获取首页电视剧列表接口
router.get('/getOperaFew',function( request , response ){
    var queryOperaFew = $sql.film.query_few_opera;                //查询电视剧类最后即最新的4条数据
    conn.query(queryOperaFew,function( err , result ){
        if(err){
            console.log(err);
        }
        if(result){                                              
            response.send(result);
        }
    });     
});

//获取首页综艺节目列表接口
router.get('/getTvshowFew',function( request , response ){
    var queryTvshowFew = $sql.film.query_few_tvshow;                //查询电视剧类最后即最新的4条数据
    conn.query(queryTvshowFew,function( err , result ){
        if(err){
            console.log(err);
        }
        if(result){                                              
            response.send(result);
        }
    });     
});

//获取首页图书列表接口
router.get('/getBookFew',function( request , response ){
    var queryBookFew = $sql.film.query_few_book;                //查询电视剧类最后即最新的4条数据
    conn.query(queryBookFew,function( err , result ){
        if(err){
            console.log(err);
        }
        if(result){                                              
            response.send(result);
        }
    });     
});


//获取所有某一类型的影片列表，从前端传过来的参数params.etype即要查询的类型
router.post('/getAllItem',function( request , response ){
    var type = request.body.etype;
    var page = (request.body.page-1)*3;
    var queryGetAll = $sql.film.query_all_item;
    conn.query(queryGetAll,[type,page],function( err , result ){
        if(err){
            console.log(err);
        }
        if(result[0]!==undefined){
            response.send(result);
        }else{
            response.send('-1');
        }
    });
});

//获取某部电影或电视剧等的具体信息
router.post('/getFilmDetail',function( request , response){
    var eno = request.body.eno;
    console.log(eno);
    var getItemDetail = $sql.film.query_item_detail;
    conn.query(getItemDetail,eno,function(err,result){
        if(err){
            console.log(err);
        }
        if(result){
            response.send(result);
        }
    });
});

//获取用户对于该电影的评价信息
router.post('/getMyComment',function( request , response ){
    var myid = request.body.myId;
    var filmid = request.body.filmId;
    var queryMyComment = $sql.comment.query_my_comment;
    conn.query(queryMyComment,[myid,filmid],function(err,result){
        if(err){
            console.log(err);
        }
        if(result[0]!==undefined){               //用户已经对影片进行评价
            response.send(result[0]);
        }else{
            response.send('-1');                //用户尚未对影片进行评价
        }
    });
});

//设置用户对某一影片的评价接口,先查询该用户对该评价是否已存在于数据库中，如是则更新记录，否则插入新记录
router.post('/setMyScore',function( request , response ){
    var myid = request.body.setUserId;
    var filmid = request.body.setFilmId;
    var currentScore = request.body.setscore;
    var currentContent = request.body.setContent;
    moment.locale();
    var dayToComment = moment().format('YYYY-MM-DD');

    var queryMyComment = $sql.comment.query_my_comment;
    conn.query(queryMyComment,[myid,filmid],function(err,result){   //查询是否已有记录
        if(err){
            console.log(err);
        }
        if(result[0]!==undefined){             //数据库中已经有该用户对该影片的操作，执行更新操作
            var updateMyComment = $sql.comment.update_my_comment;
            conn.query(updateMyComment,[ currentScore, currentContent, dayToComment, filmid, myid],function(errin,resultin){
                if(errin){
                    console.log(errin);
                }
                if(resultin){
                    response.send('1');                           //更新成功
                }
            });
        }else{                                                   //没有该用户对该影片的记录，插入一条记录
            var insertMyComment = $sql.comment.add_my_comment;
            conn.query(insertMyComment,[ filmid, myid, currentScore, currentContent , dayToComment],function(errinse,resultinse){
                if(errinse){
                    console.log(errinse);
                }
                if(resultinse){
                    response.send('1');                          //插入成功
                }
            });
        }
    });
});

//获取某一影片的评分接口，分为两部分获取，先获取总评分和评分人数，之后获取各个分数段的评分人数，统计百分比
router.post('/scoreSituation',function( request , response){
    var queryTotallyScore = $sql.filmstar.query_totally_star;
    var filmNo = request.body.filmNo;
    conn.query(queryTotallyScore,filmNo,function(err,result){
        if(err){
            console.log(err);
        }
        if(result){              //查询总评分成功
            if(result[0].count==0){
                response.send('-1');              //没有人评分则返回
            }else{
                var Count = result[0].count;      //评分人数
                var Avg = result[0].score;        //分数
                var query_every_star = $sql.filmstar.query_every_star;
                conn.query(query_every_star,filmNo,function(errin,resin){//查询各星级的评分人数
                    var score1 = 0;
                    var score2 = 0;
                    var score3 = 0;
                    var score4 = 0;
                    var score5 = 0;
                    for(i=0;i<resin.length;i++){        //从返回的结果中提取出各个分数阶层的评分人数，返回结果数据结构如下：[RowDataPacket{count:...,score；...},RowDataPacket{......}]
                        switch(resin[i].score){
                            case 1:score1 = resin[i].count1;break;
                            case 2:score2 = resin[i].count1;break;
                            case 3:score3 = resin[i].count1;break;
                            case 4:score4 = resin[i].count1;break;
                            case 5:score5 = resin[i].count1;break;
                        }
                    }
                    var wholeObject = {countT:Count,avgT:Avg,score1:score1,score2:score2,score3:score3,score4:score4,score5:score5};
                    response.send(wholeObject);                            //把整个拼接的分数对象返回
                });
            }
        }
    });
});

//获取热门评论接口
router.post('/getHotComment',function( request , response ){
    var eno = request.body.eno;
    var queryHotComment = $sql.comment.query_hot_comment;
    conn.query(queryHotComment,eno,function(err,result){
        if(err){
            console.log(err);
        }
        if(result[0]!==undefined){
            response.send(result);                            //返回最多10条热门评论
        }
    });
});

//获取所有评论接口
router.post('/getAllComment',function( request , response){
    var query_all_comment = $sql.comment.query_all_comment;
    var eno = request.body.eno;
    conn.query(query_all_comment,eno,function(err,result){
        if(err){
            console.log(err);
        }
        if(result[0]!==undefined){
            response.send(result);
        }
    });
});

//获取用户点赞列表接口
router.post('/userLikeList',function( request , response){
    var uno =  request.body.uno;
    var queryThumbList = $sql.comment.query_thumb_list;
    conn.query(queryThumbList,uno,function(err,result){
        if(err){
            console.log(err);
        }
        if(result){
            response.send(result);
        }
    });
});

//设置有用点赞或取消点赞
router.post('/setCommentLike',function( request , response ){ 
    var queryHasLike = $sql.comment.query_has_like;
    var usno = request.body.usno;                      //点赞操作的用户的id
    var ucno = request.body.ucno;                      //点赞的评论的id
    //先检查点赞数据库中是否有用户的点赞记录
    conn.query(queryHasLike,[ucno,usno],function(errHasLike,resHasLike){
        if(errHasLike){
            console.log(errHasLike);
        }
        if(resHasLike[0]!==undefined){                  //已存在该用户对该评论的点赞记录，则查询该记录是点赞还是取消赞
            var hisLike = resHasLike[0].likeit;
            var updateMyLike = $sql.comment.update_my_like;
            if(hisLike == 1){                           //用户之前是点赞，则现在是要取消赞
                conn.query(updateMyLike,[0,ucno,usno],function(errUpdateToZero,resUpdateToZero){
                    if(errUpdateToZero){
                        console.log(errUpdateToZero);
                    }
                    else if(resUpdateToZero){           //更新取消赞成功
                        var subtractCommentLike = $sql.comment.subtract_total_like;
                        conn.query(subtractCommentLike,ucno,function(errSubtractLike,resSubtractLike){ //把评论对应的总点赞数减一
                            if(errSubtractLike){
                                console.log(errSubtractLike);
                            }
                            else if(resSubtractLike){
                                response.send('2');                //'2',取消点赞更新个人对此评论和此评论取消点赞成功
                            }
                        })
                    }
                });
            }

            else if(hisLike == 0){                                 //用户之前是取消点赞，则当前操作是点赞
                conn.query(updateMyLike,[1,ucno,usno],function(errUpdateToOne,resUpdateToOne){
                    if(errUpdateToOne){
                        console.log(errUpdateToOne);
                    }
                    else if(resUpdateToOne){           //更新点赞成功
                        var addCommentLike = $sql.comment.add_total_like;
                        conn.query(addCommentLike,ucno,function(errAddLike,resAddLike){ //把评论对应的总点赞数加一
                            if(errAddLike){
                                console.log(errAddLike);
                            }
                            else if(resAddLike){
                                response.send('1');                //'1',点赞，更新个人对此评论和此评论点赞成功
                            }
                        });
                    }
                });
            }
        }

        else{      //用户之前没有对该评论进行过操作，则插入一条点赞信息
            var addMyLike = $sql.comment.add_my_like;
            conn.query(addMyLike,[ucno,usno],function(errInsert,resInsert){
                if(errInsert){
                    console.log(errInsert);
                }
                else if(resInsert){             //插入我的点赞成功，更新评论表中点赞数
                    var addUserLike = $sql.comment.add_total_like;
                    conn.query(addUserLike,ucno,function(errAddAllLike,resAddAllLike){
                        if(errAddAllLike){
                            console.log(errAddAllLike);
                        }
                        else if(resAddAllLike){
                            response.send('1');               //‘1’，点赞，成功插入该用户点赞信息并更新评论数据库的总赞数
                        }
                    });
                }
            });
        }

    });
});

module.exports = router;
