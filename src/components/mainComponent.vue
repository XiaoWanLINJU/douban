<template>
    <div class='wrapper'>

        <!-- 顶部搜索栏 -->
        <div class='top-banner'>
            <div class='sreach'>
                <input class='search-input' type='text' @keyup.enter='enterSearch' @blur='leaveSearch' v-model.trim='searchContent' @keyup='searchEvent' placeholder='影视 图书等'>
                <div class='seUlDiv'>
                    <ul class='searchUl'>
                        <li v-for='(item,index) in mySearchList' v-if='index<5' @mousedown='goToDetail(item.eno)' class='wordList'>{{item.ename}}&nbsp</li>
                    </ul>
                </div>
            </div>
        </div>

        <!--本页内容导航栏 -->
        <div class='main-banner'>
            <div class='list-type'>
                <a class='list-item' href='#1'  :class="{'highLight': highlight1}">电影</a>
                <a class='list-item' href='#2'  :class="{'highLight': highlight2}">电视剧</a>
                <a class='list-item' href='#3'  :class="{'highLight': highlight3}">综艺</a>
                <a class='list-item' href='#4'  :class="{'highLight': highlight4}">图书</a>
            </div>
        </div>
        
        <!-- 四个图片轮播组件 -->
        <div class='body-wrapper'>
            <showpicture id='1' :movies='movie' v-if='movieFlag' v-on:scrollEvent='executeScroll'></showpicture>
            <showpicture id='2' :movies='opera' v-if='operaFlag' v-on:scrollEvent='executeScroll'></showpicture>
            <showpicture id='3' :movies='tvshow' v-if='tvshowFlag' v-on:scrollEvent='executeScroll'></showpicture>
            <showpicture id='4' :movies='book' v-if='bookFlag' v-on:scrollEvent='executeScroll'></showpicture>
        </div>

        <!-- 为底部被挡住的元素设置一个展位div -->
        <div class='bottom-placeholder'></div>

    </div>
</template>

<script>
import axios from 'axios'
import vue from 'vue'
vue.prototype.$axios = axios
import showpicture from './mainEntertainmentType'

export default{
    data(){
        return{
            movie:[],                    //电影类首页面展示的影片
            movieFlag:false,              //阻止异步向子组件发送参数为空事件
            opera:[],                    //电视剧类首页面展示的影片
            operaFlag:false,              //阻止异步向子组件发送参数为空事件
            tvshow:[],                    //综艺类首页面展示的影片
            tvshowFlag:false,              //阻止异步向子组件发送参数为空事件
            book:[],                    //图书类首页面展示的影片
            bookFlag:false,              //阻止异步向子组件发送参数为空事件
            highlight1:true,
            highlight2:false,
            highlight3:false,
            highlight4:false,

            searchContent:'',              //顶部搜索框的内容
            timer:null,                      //延时处理搜索框的计时器
            CancelToken:axios.CancelToken,
            cancel:null,                     //受否取消上次axios请求
            mySearchList:null                //储存查询结果的列表
        }
    },
    components:{showpicture},
    created:function(){
       var _this = this;

       //实例被创建时向服务器请求首页展示的电影列表
        this.$axios.get('/api/film/getMovieFew').then(function(res){  
            _this.movie.push(res.data);
            _this.movieFlag = true;
        }).catch(function(err){
            console.log(err);
        });

        //实例被创建时向服务器请求首页展示的电视剧列表
        this.$axios.get('/api/film/getOperaFew').then(function(res){
            _this.opera.push(res.data);
            _this.operaFlag = true;
        }).catch(function(err){
            console.log(err);
        });

        //实例被创建时向服务器请求首页展示的综艺列表
        this.$axios.get('/api/film/getTvshowFew').then(function(res){
            _this.tvshow.push(res.data);
            _this.tvshowFlag = true;
        }).catch(function(err){
            console.log(err);
        });

        //实例被创建时向服务器请求首页展示的图书列表
        this.$axios.get('/api/film/getBookFew').then(function(res){
            _this.book.push(res.data);
            _this.bookFlag = true;
        }).catch(function(err){
            console.log(err);
        });
        
    },
    mounted:function(){
        this.$on('searchhandler',this.searchHandler);
    },
    methods:{
        executeScroll:function(data){
            switch(data){
            case '1':{
                this.highlight1 = true;
                this.highlight2 = false;
                this.highlight3 = false;
                this.highlight4 = false;
                break;
            }
            case '2':{
                this.highlight1 = false;
                this.highlight2 = true;
                this.highlight3 = false;
                this.highlight4 = false;
                break;
            }
            case '3':{
                this.highlight1 = false;
                this.highlight2 = false;
                this.highlight3 = true;
                this.highlight4 = false;
                break;
            }
            case '4':{
                this.highlight1 = false;
                this.highlight2 = false;
                this.highlight3 = false;
                this.highlight4 = true;
                break;
            }
            }
        },
        searchEvent:function(){//用户在输入框中输入输入后向后台查询项目
            var _this = this;
            this.clearTimer();
            if(this.searchContent&&this.searchContent.length>0){
                this.timer = setTimeout(function(){_this.$emit('searchhandler',_this.searchContent);}
                ,500);
            }else{
                this.$emit('searchhandler',this.searchContent);
            }
        },
        clearTimer:function(){//用户在500ms内又输入则重新计时
            if(this.timer){
                clearTimeout(this.timer);
            }
        },
        searchHandler:function(Content){       //请求查询搜索关键词操作
            var _this = this;
            if(Content.length==0){
                this.mySearchList = null;
                return ;
            }
            if(this.cancel){//当检测到之前有请求时，取消该请求
                this.cancel('cancel by user');
            }
            this.$axios.post('/api/search/getMySearch',{word:Content,cancelToken:new this.CancelToken((c)=>{
                _this.cancel = c;
            })}).then(function(res){
                if(res.data=='-1'){//在数据库查询不到包含该关键词的影片时
                    _this.mySearchList = null;
                }else{
                    _this.mySearchList = res.data;
                }
            }).catch(function(err){
                console.log(err);
            });
        },

        goToDetail:function(paraEno){//跳转到用户搜索的影片的具体页面
            this.$router.push({path:'/detail',query:{eno:paraEno}});
        },

        enterSearch:function(){//用户在搜索框按enter键
            if(this.mySearchList==null){              //axios查询返回结果为空
                alert('抱歉，查询不到该影片');
                return;
            }else{
                var flag = false;
                for(var i=0;i<this.mySearchList.length;i++){
                    if(this.mySearchList[i].ename.replace(/\s/g,'') == this.searchContent){//比较enter时输入框内的内容是否与数据库查询返回的数组中某一项相同，这里会去掉返回的数组中的空格键
                        flag = true;
                        this.$router.push({path:'/detail',query:{eno:this.mySearchList[i].eno}});
                        break;
                    }
                }
                if(!flag){
                    alert('抱歉，查询不到该影片');
                    return;
                }
            }
        },
        leaveSearch:function(){
            this.mySearchList = null;
        }

    },

    
}

</script>

<style scoped>

.main-banner{
    position:fixed;
    top:40px;
    z-index:1;
    height:30px;
    width:100%;
}
.list-type{
    padding:5px 0;
    background-color:#fff;
    color:#000;
    font-size:14px;
    display:flex;
    justify-content:space-around;
}
.body-wrapper{
    -moz-box-sizing:border-box;
    -webkit-box-sizing:border-box;
    box-sizing:border-box;
    margin-top:75px;
    margin-left:0px;
    width:100%;
    background-color:#d3d3d3;
    margin-bottom:30px;
}
img{
    height:50px;
    width:50px;
}
.highLight{
    color:#00bb00;
}
</style>

