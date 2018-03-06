<template>
    <div class='certainWrapper'>

        <!-- 返回按钮 -->
        <div class='topGoBack top-banner'>
            <a class='topGoBackA' @click='goBack'><&nbsp;返回</a>
        </div>

        <!-- 主体部分 -->
        <div class='certainBodyWrapper'>
            <!-- 顶部图片信息 -->
            <div class='certainBodyTopImgDiv'>
                <img v-for='item in itemDetail' class='certainBodyTopImg' v-if='showPict' :src="require('../../static/entertainimg/'+item.eimage)">
            </div>

            <!-- 影片信息及评分栏 -->
            <div class='certainFilmInfoWrapper set-box-border'>
                <div class='certainFilmInfoLeft' v-for='item in itemDetail'>
                    <p>{{item.ename}}</p>
                    <span>类型：{{item.econtent}}</span><br>
                    <span>国家：{{item.ecountry}}</span><br>
                    <span>时间：{{item.etime}}</span><br>
                </div>
                <!-- 评分栏 -->
                <div class='certainFilmInfoRight'>
                    <h3 v-if='!showScore'>评分人数不足</h3>
                    <h3 v-if='showScore'>分数:{{finalScore}}&nbsp;({{amountOfPeopleScore}}人评分)</h3>
                    <div class='certainFilmScoreList'>
                        <div class='testStar'><span class='wordStarType'>5星:</span><div class='proprotionStyle' :style="{width:width5+'px'}"></div>{{proportionOf5}}%</div>
                        <div class='testStar'><span class='wordStarType'>4星:</span><div class='proprotionStyle' :style="{width:width4+'px'}"></div>{{proportionOf4}}%</div>
                        <div class='testStar'><span class='wordStarType'>3星:</span><div class='proprotionStyle' :style="{width:width3+'px'}"></div>{{proportionOf3}}%</div>
                        <div class='testStar'><span class='wordStarType'>2星:</span><div class='proprotionStyle' :style="{width:width2+'px'}"></div>{{proportionOf2}}%</div>
                        <div class='testStar'><span class='wordStarType'>1星:</span><div class='proprotionStyle' :style="{width:width1+'px'}"></div>{{proportionOf1}}%</div>
                    </div>
                </div>
            </div>

            <!-- 用户评分栏 -->
            <div class='certainFilmMyScore'>
                <input type='button' class='cannotRankBtn' @click='goToLogin' value='已看过' v-if='notYetLogin'>
                
                <div class='myRankWrapper' v-if='!notYetLogin'>
                    <div class='myRankTop'>
                        <span class='myRankTime'>时间:{{myCommentTime}}</span>
                        <span class='myRankToRank'>
                            <input type='button' @click='setScore' class='myRankToBtn' value='评分'>
                        </span>
                    </div>
                    <!-- 星级 -->
                    <div class='starWord'>分数：</div>
                    <div class='starList'>
                        <img class='starImg' :src='starSrc1' @click='changeMyScore(1)' @mouseover='enterStar(1)' @mouseleave='leaveStar(1)'>
                        <img class='starImg' :src='starSrc2' @click='changeMyScore(2)' @mouseover='enterStar(2)' @mouseleave='leaveStar(2)'>
                        <img class='starImg' :src='starSrc3' @click='changeMyScore(3)' @mouseover='enterStar(3)' @mouseleave='leaveStar(3)'>
                        <img class='starImg' :src='starSrc4' @click='changeMyScore(4)' @mouseover='enterStar(4)' @mouseleave='leaveStar(4)'>
                        <img class='starImg' :src='starSrc5' @click='changeMyScore(5)' @mouseover='enterStar(5)' @mouseleave='leaveStar(5)'>
                    </div>
                    <div class='myCommentWork'>
                        <textarea v-model='myCommentContent' class='myCommentWordArea'></textarea>
                    </div>
                </div>

            </div>

            <!-- 该影片的用户评价在下方渲染，顶部是两个按钮，分别指向展示热门评论和全部评论 -->
            <div class='CertainFilmUserComment'>
                <div class='CommentTopBanner'>
                    <span class='hotCommentBtn' @click='toggleCommentContentBtn(1)' :class='{atThisCommBtn: isShowHotComment}'>热门评论</span>
                    <span class='allCommentBtn' @click='toggleCommentContentBtn(2)' :class='{atThisCommBtn: !isShowHotComment}'>全部评论</span>
                </div>

                <!-- 热门评论区，v-for渲染出最多前10条热门评论，顶部是该评论所属的用户、该用户所给的评分和一个‘有用’按钮 -->
                <transition name='transLeft'>
                    <div class='userCommentArea' v-if='isToRenderHot'>
                        <div v-for='(item,index) in hotCommentList' class='hotItemWrapper'>
                            <!-- 顶部用户信息区域 -->
                            <div class='theUserOfComment'>
                                <div class='useName'>{{item.username}}</div>
                                <img class='userStarImg' :src="require('../../static/entertainimg/'+item.score+'.png')">
                                <a class='thisCommentIsUseful' @click='thisIsUsefulBtn(item.ucno,1,index)' :class='{isUseful: item.hasComment}'>有用({{item.commentlike}})</a>
                            </div>
                            <!-- 用户评价内容区域 -->
                            <div class='theUserCommentContent set-box-border'>
                                {{item.comment}}
                            </div>
                            <!-- 底部评价日期区域 -->
                            <div class='theUserCommentDay'>{{item.commenttime}}</div> 
                        </div>
                    </div>
                </transition>

                <!-- 所有评论区，v-for渲染出所有评论，顶部是该评论所属的用户、该用户所给的评分和一个‘有用’按钮 -->
                <transition name='transRight'>
                    <div class='userCommentArea' v-if='isToRenderAll'>
                        <div v-for='(item,index) in allCommentList' class='hotItemWrapper'>
                            <!-- 顶部用户信息区域 -->
                            <div class='theUserOfComment'>
                                <div class='useName'>{{item.username}}</div>
                                <img class='userStarImg' :src="require('../../static/entertainimg/'+item.score+'.png')">
                                <a class='thisCommentIsUseful' @click='thisIsUsefulBtn(item.ucno,2,index)' :class='{isUseful: item.hasComment}'>有用({{item.commentlike}})</a>
                            </div>
                            <!-- 用户评价内容区域 -->
                            <div class='theUserCommentContent set-box-border'>
                                {{item.comment}}
                            </div>
                            <!-- 底部评价日期区域 -->
                            <div class='theUserCommentDay'>{{item.commenttime}}</div> 
                        </div>
                    </div>
                </transition>
                
            </div>
            

        </div>
    </div>
</template>

<script>
import moment from 'moment'
import thenjs from 'thenjs'
import vue from 'Vue'

export default{
    data(){
        return{
            eno:'',                                //当前影片在数据库中的编号
            itemDetail:'',                         //存储影片基本信息的List
            showPict:false,                        //用于异步加载顶部图片，避免刚进入页面时尚未获取图片地址导致加载错误
            ename:'',                  
            notYetLogin:false,                     //判断用户是否尚未登陆，以控制用户个人操作栏显示不同界面
            //以下5项用于动态加载星星图，因为星星图要根据滑过与否、是否已评过分而显示不同颜色
            starSrc1:require('../../static/entertainimg/starBefore.png'),
            starSrc2:require('../../static/entertainimg/starBefore.png'),
            starSrc3:require('../../static/entertainimg/starBefore.png'),
            starSrc4:require('../../static/entertainimg/starBefore.png'),
            starSrc5:require('../../static/entertainimg/starBefore.png'),
            userid:'',                            //当前用户的后台id  
            myCommentList:'',                     //用户的个人评价情况，包含电影的编号，用户的编号，分数星级，文字评价，该评价获得的点赞数  
            myCommentContent:'',                  //我对影片内容的评价
            myCommentTime:'',                      //评价时间
            myOriginalStar:0 ,                    //我的星级
            myNewScore:0,                          //我的新星级
            isClickStar:false,                      //是否点击了星星，如果为true则把mouseleave设置为不执行，以避免mouseleave和click事件不同时执行的冲突
            finalScore:'',                           //最终分数
            amountOfPeopleScore:'',                   //评分人数
            showScore:false,                          //是否因评分人数达到要求而显示

            //以下5项显示各分数段的比例
            proportionOf1:0,
            proportionOf2:0,
            proportionOf3:0,
            proportionOf4:0,
            proportionOf5:0,

            proportionWidth:70,
            //以下5项定义各分数段的百分比条长度
            width1:0,
            width2:0,
            width3:0,
            width4:0,
            width5:0,

            isShowHotComment:true,                          //是否展示热门评论模块
            hotCommentList:'',                              //保存热门评论的数组
            isToRenderHot:false,                           //控制热门评论数组被成功赋值之前展示热门评论的元素不被渲染
            allCommentList:'',                              //保存所有评论的数组
            isToRenderAll:false,                           //控制所有评论数组被成功赋值之前展示热门评论的元素不被渲染
        }
    },

    watch:{
        myOriginalStar(newVal,oldVal){
            switch(this.myOriginalStar){
                case 1:{
                    this.enterStar(1);
                    break;
                }
                case 2:{
                    this.enterStar(2);
                    break;
                }
                case 3:{
                    this.enterStar(3);
                    break;
                }
                case 4:{
                    this.enterStar(4);
                    break;
                }
                case 5:{
                    this.enterStar(5);
                    break;
                }
            }
        }
    },

    created:function(){
        var _this = this;
        //首先获取当前页面所要展示的电影的具体信息，包括顶部图片和片名、类型等基本信息
        this.$axios.post('/api/film/getFilmDetail',{'eno':this.$route.query.eno}).then(function(res){
            _this.itemDetail = res.data;
            _this.ename = res.data.ename;
            _this.showPict = true;
        }).catch(function(err){
            console.log(err);
        });

        //获取用户是否登陆，如果登陆则显示未登录界面，即中间个人操作栏跳转到登陆界面的按钮，
        //否则显示获取当前用户对于该影片的评价信息
        this.$axios.get('/api/user/getSessionName').then(function(res){
            if(res.data=='-1'){
                _this.notYetLogin = true;
            }else{
                _this.notYetLogin = false;
                _this.userid = res.data.sessionid;

                //获取当前用户的评价信息
                _this.$axios.post('/api/film/getMyComment',{myId:res.data.sessionid,filmId:_this.$route.query.eno}).then(function(resinner){
                    if(resinner.data!='-1'){       //用户已经评价才显示评价结果
                        _this.myCommentList = resinner.data;
                        _this.myCommentContent = resinner.data.comment;
                        _this.myCommentTime = resinner.data.commenttime;
                        _this.myOriginalStar = resinner.data.score;
                    }
                }).catch(function(err){
                    console.log(err);
                });

            }
        }).catch(function(err){
            console.log(err);
        });

        //获取该影片的评价情况，首先获取分数和评分人数，然后获取各个分数段的评分人数
        this.$axios.post('/api/film/scoreSituation',{filmNo:_this.$route.query.eno}).then(function(res){
            if(res.data=='-1'){   //评分人数不够
                _this.showScore = false;
            }else{
                _this.showScore = true;
                _this.finalScore = Number(res.data.avgT).toFixed(1);            //总分情况
                _this.amountOfPeopleScore = res.data.countT;        //评分人数
                if(res.data.score1!=0) _this.proportionOf1 = Number((res.data.score1/res.data.countT)*100).toFixed(2);
                if(res.data.score2!=0) _this.proportionOf2 = Number((res.data.score2/res.data.countT)*100).toFixed(2);
                if(res.data.score3!=0) _this.proportionOf3 = Number((res.data.score3/res.data.countT)*100).toFixed(2);
                if(res.data.score4!=0) _this.proportionOf4 = Number((res.data.score4/res.data.countT)*100).toFixed(2);
                if(res.data.score5!=0) _this.proportionOf5 = Number((res.data.score5/res.data.countT)*100).toFixed(2);
                _this.width1 = _this.proportionWidth * (res.data.score1/res.data.countT);  //计算分数显示横条的宽度
                _this.width2 = _this.proportionWidth * (res.data.score2/res.data.countT);
                _this.width3 = _this.proportionWidth * (res.data.score3/res.data.countT);
                _this.width4 = _this.proportionWidth * (res.data.score4/res.data.countT);
                _this.width5 = _this.proportionWidth * (res.data.score5/res.data.countT);
            }
        }).catch(function(err){
            console.log(err);
        });

        //调用获取热门评论的方法
        this.getHotComment();
    },

    methods:{

        setScore:function(){
            if(this.myNewScore == 0){
                alert('请给本片打星');
                return false;
            }else{//执行打分操作
                var _this = this;
                this.$axios.post('/api/film/setMyScore',{setUserId:_this.userid,setFilmId:_this.$route.query.eno,setscore:_this.myNewScore,setContent:_this.myCommentContent}).then(function(res){
                    if(res.data=='1'){
                        
                        alert('已为该影片打分');
                        _this.$router.go(0);
                    }else{
                        alert('出了点小问题，请稍后重试');
                    }
                }).catch(function(err){
                    console.log(err);
                })
            }
        },

        //在用户鼠标滑过评分栏星星时显示星星的颜色为黄色，途径是更改星星图片，滑过第二颗星时前面的两颗星都要换图，依此类推
        enterStar:function(starIndex){
            switch(starIndex){
                case 1:{
                    this.starSrc1 = require('../../static/entertainimg/starAfter.png');
                    this.starSrc2 = require('../../static/entertainimg/starBefore.png');
                    this.starSrc3 = require('../../static/entertainimg/starBefore.png');
                    this.starSrc4 = require('../../static/entertainimg/starBefore.png');
                    this.starSrc5 = require('../../static/entertainimg/starBefore.png');
                    break;
                }
                case 2:{
                    this.starSrc1 = require('../../static/entertainimg/starAfter.png');
                    this.starSrc2 = require('../../static/entertainimg/starAfter.png');
                    this.starSrc3 = require('../../static/entertainimg/starBefore.png');
                    this.starSrc4 = require('../../static/entertainimg/starBefore.png');
                    this.starSrc5 = require('../../static/entertainimg/starBefore.png');
                    break;
                }
                case 3:{
                    this.starSrc1 = require('../../static/entertainimg/starAfter.png');
                    this.starSrc2 = require('../../static/entertainimg/starAfter.png');
                    this.starSrc3 = require('../../static/entertainimg/starAfter.png');
                    this.starSrc4 = require('../../static/entertainimg/starBefore.png');
                    this.starSrc5 = require('../../static/entertainimg/starBefore.png');
                    break;
                }
                case 4:{
                    this.starSrc1 = require('../../static/entertainimg/starAfter.png');
                    this.starSrc2 = require('../../static/entertainimg/starAfter.png');
                    this.starSrc3 = require('../../static/entertainimg/starAfter.png');
                    this.starSrc4 = require('../../static/entertainimg/starAfter.png');
                    this.starSrc5 = require('../../static/entertainimg/starBefore.png');
                    break;
                }
                case 5:{
                    this.starSrc1 = require('../../static/entertainimg/starAfter.png');
                    this.starSrc2 = require('../../static/entertainimg/starAfter.png');
                    this.starSrc3 = require('../../static/entertainimg/starAfter.png');
                    this.starSrc4 = require('../../static/entertainimg/starAfter.png');
                    this.starSrc5 = require('../../static/entertainimg/starAfter.png');
                    break;
                }
            }
        },

        //用户鼠标滑出星星时，图片退回原来的样子
        leaveStar:function(){
            if(this.isClickStar==true){
                this.isClickStar = false;
                return;
            }else{
                switch(this.myOriginalStar){
                    case 1:{
                        this.starSrc1 = require('../../static/entertainimg/starAfter.png');
                        this.starSrc2 = require('../../static/entertainimg/starBefore.png');
                        this.starSrc3 = require('../../static/entertainimg/starBefore.png');
                        this.starSrc4 = require('../../static/entertainimg/starBefore.png');
                        this.starSrc5 = require('../../static/entertainimg/starBefore.png');
                        break; 
                    }
                    case 2:{
                        this.starSrc1 = require('../../static/entertainimg/starAfter.png');
                        this.starSrc2 = require('../../static/entertainimg/starAfter.png');
                        this.starSrc3 = require('../../static/entertainimg/starBefore.png');
                        this.starSrc4 = require('../../static/entertainimg/starBefore.png');
                        this.starSrc5 = require('../../static/entertainimg/starBefore.png');
                        break; 
                    }
                    case 3:{
                        this.starSrc1 = require('../../static/entertainimg/starAfter.png');
                        this.starSrc2 = require('../../static/entertainimg/starAfter.png');
                        this.starSrc3 = require('../../static/entertainimg/starAfter.png');
                        this.starSrc4 = require('../../static/entertainimg/starBefore.png');
                        this.starSrc5 = require('../../static/entertainimg/starBefore.png');
                        break; 
                    }
                    case 4:{
                        this.starSrc1 = require('../../static/entertainimg/starAfter.png');
                        this.starSrc2 = require('../../static/entertainimg/starAfter.png');
                        this.starSrc3 = require('../../static/entertainimg/starAfter.png');
                        this.starSrc4 = require('../../static/entertainimg/starAfter.png');
                        this.starSrc5 = require('../../static/entertainimg/starBefore.png');
                        break; 
                    }
                    case 5:{
                        this.starSrc1 = require('../../static/entertainimg/starAfter.png');
                        this.starSrc2 = require('../../static/entertainimg/starAfter.png');
                        this.starSrc3 = require('../../static/entertainimg/starAfter.png');
                        this.starSrc4 = require('../../static/entertainimg/starAfter.png');
                        this.starSrc5 = require('../../static/entertainimg/starAfter.png');
                        break; 
                    }
                }
            }
        },

        changeMyScore:function(newIndex){
            this.isClickStar = true;
            this.myNewScore = newIndex;   
            this.enterStar(newIndex);
        },

        //获取热门评论方法，在created钩子中调用一次，页面生成的默认显示即热门评论，点击‘热门评论’键时也调用此方法
        getHotComment:function(){
            var _this = this;            
            this.$axios.post('/api/film/getHotComment',{'eno':this.$route.query.eno}).then(function(res){
                if(res.data){
                    _this.hotCommentList = res.data;
                    if(_this.userid){//如果用户已登陆，则判断其对每一条评论是否点赞
                        //获取用户点赞的评论的列表
                        _this.showCommentIdOfUserLike(_this.userid,res.data,1);
                    }else{
                        _this.isToRenderHot = true;
                    }
                    
                }
            }).catch(function(err){
                console.log(err);
            });
        },

        //获取所有评论方法，点击‘所有评论’时调用该方法
        getAllComment:function(){
            var _this = this;            
            this.$axios.post('/api/film/getAllComment',{'eno':this.$route.query.eno}).then(function(res){
                if(res.data){
                    _this.allCommentList = res.data;
                    //_this.isToRenderAll = true;
                    if(_this.userid){//如果用户已登陆，则判断其对每一条评论是否点赞
                        //获取用户点赞的评论的列表
                        _this.showCommentIdOfUserLike(_this.userid,res.data,2);
                    }else{
                        _this.isToRenderAll = true;
                    }
                }
            }).catch(function(err){
                console.log(err);
            });
        },

        //根据用户点击'热评'或'全部'按钮调用不同获取评论方法
        toggleCommentContentBtn:function(way){
            if(way==1){//用户点击了‘热评’
                this.getHotComment();
                this.isShowHotComment = true;
                this.isToRenderAll = false;
            }else if(way==2){
                this.getAllComment();
                this.isShowHotComment = false;
                this.isToRenderHot = false;
            }
        },

        //获取当前用户点赞的所有评论的id的数组，用于后面判断用户是否点赞,执行的前提是用户已经登陆,resData是当前页面的所有评论
        showCommentIdOfUserLike:function(uno,resData,hotOrAll){
            var _this = this;
            this.$axios.post('/api/film/userLikeList',{uno:uno}).then(function(res1){//res1是返回的用户点赞列表
                if(res1.data!=null){              //有点赞记录
                        for(var i=0;i<resData.length;i++){
                            var flag = _this.hasLikeThisComment(resData[i].ucno,res1); 
                            if(hotOrAll == 1){
                                _this.hotCommentList[i].hasComment = flag; 
                            }
                            else if(hotOrAll == 2){
                                _this.allCommentList[i].hasComment = flag;   
                            }
                        }
                }else{
                    console.log('sdajklfajklsjdf');
                }
                if(hotOrAll == 1){
                    _this.isToRenderHot = true;                    
                }else if(hotOrAll == 2){
                    _this.isToRenderAll = true;
                }
            });
        },

        //在获取了每一条评论之后,判断用户是否已经对评论点赞，参数uno是用户的id，ucno是评论id,likelist是用户点赞的评论列表
        hasLikeThisComment:function(ucno1,likelist){
            var flag = false;                       //flag定义是否有当前评论的点赞纪录
            for(var i=0;i<likelist.data.length;i++){
                if(likelist.data[i].ucno == ucno1){
                    flag = true;
                    break;
                }
            }
            return flag;
        },

        //用户点击‘有用’，记录用户对该评论的点赞信息，并更新按钮
        thisIsUsefulBtn:function(parUcno,changeLikeHotOrAll,indexOfComment){
            if(!this.userid){
                alert('请登陆后再操作');
                return false;
            }
            var _this = this;
            this.$axios.post('/api/film/setCommentLike',{'usno':this.userid,'ucno':parUcno}).then(function(res){
                    if(res.data == 1){       //点赞操作成功
                        if(changeLikeHotOrAll == 1){   //点击的是热门评论
                            _this.hotCommentList[indexOfComment].hasComment = true;
                            _this.hotCommentList[indexOfComment].commentlike += 1;
                        }else if(changeLikeHotOrAll == 2){//点击的是所有评论
                            _this.allCommentList[indexOfComment].hasComment = true;
                            _this.allCommentList[indexOfComment].commentlike += 1;
                        }
                    }
                    else if(res.data == 2){       //取消点赞操作成功
                        if(changeLikeHotOrAll == 1){   //点击的是热门评论
                            _this.hotCommentList[indexOfComment].hasComment = false;
                            _this.hotCommentList[indexOfComment].commentlike -= 1;
                        }else if(changeLikeHotOrAll == 2){//点击的是所有评论
                            _this.allCommentList[indexOfComment].hasComment = false;
                            _this.allCommentList[indexOfComment].commentlike -= 1;
                        }
                    }
                }).catch(function(err){
                    console.log('errhere');
                    console.log(err);
                });
        },

        goBack:function(){
            this.$router.go(-1);
        },

        goToLogin:function(){//用户在未登录情况下点击已看过，则跳转至登陆界面
            alert('您尚未登陆');
            this.$router.push({path:'/userAuthority/goToLogin'});
        }
    },

    

}
</script>

<style >
.certainWrapper{
    background-color:#fff;
}
.topGoBack{
    text-align:left;
}
.topGoBackA{
    color:#fff;
    font-size:14px;
    margin:0 15px;
    width:50px;
    height:20px;
    padding:0;
    position:fixed;
    top:10px;
}
.certainBodyWrapper{
    width:100%;
    position:relative;
    margin-top:41px;
    margin-bottom:30px;
}
.certainBodyTopImgDiv{
    width:100%;
    height:180px;
    background-color:#8B4513;
}
.certainBodyTopImg{
    width:130px;
    height:170px;
    margin:0 auto;
    border:0.5px solid #000;
    margin-top:5px;
    border-radius:2px;
}
.certainFilmInfoWrapper{
    width:100%;
    height:150px;
    padding:10px;
    border-bottom:0.5px solid #d3d3d3;
}
.certainFilmInfoLeft{
    width:150px;
    height:120px;
    text-align:left;
    padding-left:10px;
    font-size:12px;
    color:#d3d3d3;
    float:left;
}
.certainFilmInfoLeft p{
    font-size:15px;
    color:#000;
    margin-bottom:15px;
}
.certainFilmInfoRight{
    width:150px;
    height:125px;
    font-size:12px;
    float:left;
    text-align:left;
    box-shadow:0px 0px 3px #d3d3d3;
    border:0.5px solid #fff;
    margin-left:20px;
    padding-left:10px;
    padding-top:5px;
}
.testStar{
    height:20px;
    width:100%；
}
.wordStarType{
    float:left;
    height:15px;
}
.proprotionStyle{
    height:15px;
    background-color:#FFA500;
    border:none;
    float:left;
}
.certainFilmScoreList{
    margin-top:5px;
}
.certainFilmMyScore{
    width:100%;
    border-bottom:0.5px solid #d3d3d3;
}
.cannotRankBtn{
    width:50%;
    height:30px;
    margin:50px auto;
    background-color:#fff;
    border:1px solid #FFA500;
    border-radius:4px;
    color:#FFA500;
}
.myRankWrapper{
    width:92%;
    margin:5px auto;
    background-color:#FFFFE0;
    border-radius:4px;
    border:0.8px solid #FFF68F;
    color:#000;
    font-size:14px;
}
.myRankTop{
    width:100%;
    height:35px;
    border-bottom:0.8px solid #FFF68F;
}
.myRankTime{
    float:left;
    margin-left:15px;
    margin-top:10px;
}
.myRankToRank{
    float:right;
    margin-right:15px;
}
.myRankToBtn{
    width:40px;
    height:25px;
    background-color:#FFA500;
    border:none;
    border-radius:4px;
    color:#fff;
    margin-top:5px;
    outline:none;
}
.starList{
    height:25px;
    width:100px;
    margin-left:15px;
    text-align:left;
}
.starWord{
    text-align:left;
    width:50px;
    height:20px;
    margin-top:5px;
    margin-left:15px;
}
.starImg{
    max-width:15px;
    max-height:15px;
    margin-left:1px;
    margin-top:0px;
}
.myCommentWork{
    width:90%;
    height:100px;
    border:none;
    border-radius:4px;
    margin:0 auto;
    margin-bottom:5px;
    outline:none;
    padding:5px;
    background-color:#d3d3d3;    
}
.myCommentWordArea{
    width:100%;
    height:100%;
    border:none;
    border-radius:4px;
    color:#fff;
    background-color:#d3d3d3;
    outline:none;    
}
.CertainFilmUserComment{
    width:100%;
    border-bottom:0.5px solid #d3d3d3;
    position:relative;
}
.CommentTopBanner{
    width:100%;
    height:30px;
    font-size:14px;
    padding-top:10px;
    text-align:center;
}
.hotCommentBtn{
    display:inline-block;
    width:49%;
    height:100%;
    color:#d3d3d3;
}
.allCommentBtn{
    display:inline-block;
    width:49%;
    height:100%;
    color:#d3d3d3;
}
.atThisCommBtn{
    color:#2c3e50;
    border-bottom:0.5px solid #2c3e50;
}

.userCommentArea{
    position:absolute;
    width:100%;
    font-size:14px;
    padding-bottom:30px;
}
.hotItemWrapper{
    width:100%;
    border-bottom:0.5px solid #d3d3d3;    
}
.theUserOfComment{
    width:100%;
    height:20px;
    margin-top:5px;
}
.useName{
    height:20px;
    margin-left:10px;
    float:left;    
}
.userStarImg{
    width:100px;
    height:20px;
    margin-left:5px;
}
.thisCommentIsUseful{
    height:20px;
    float:right;
    margin-right:10px;
}
.theUserCommentContent{
    width:100%;
    text-align:left;
    padding:10px;
    color:#000;
}
.theUserCommentDay{
    width:100px;
    height:20px;
    margin-left:10px;
    text-align:left;
}
.isUseful{
    background-color:#00bb00;
}

.transLeft-enter,.transRight-leave-active{
    opacity:0;
    transform:translate(30px,0);
    transition: all .3s cubic-bezier(.55,0,.1,1);
}
.transRight-enter,.transLeft-leave-active{
    opacity:0;
    transform:translate(-30px,0);
    transition: all .3s cubic-bezier(.55,0,.1,1);
}

/*
.transLeft-leave-active{
    transition:opacity 0.4s ease;
    transform:translate(-30px,0);
}
.transLeft-enter,transLeft-leaeve-to{
    opacity:0;
    transform:translate(30px,0);
}

.transRight-enter-active{
    transition:opacity 0.5s ease;
}
.transRight-leave-active{
    transition:opacity 0.4s ease;
}
.transRight-enter,transRight-leave-to{
    opacity:0;
}
*/
</style>