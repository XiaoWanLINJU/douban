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

        <div class='seeAllBody'>
            <div v-for='item in itemList' class='bodyEntireItem'>
                <img :src="require('../../static/entertainimg/'+item.eimage)" class='itemImg'>
                <div class='rightContent'>
                    <a @click='goToDetailPage(item.eno)'><h3>{{item.ename}}</h3></a>
                    <span>类型：{{item.econtent}}</span><br>
                    <span>国家/地区：{{item.ecountry}}</span><br>
                    <span>时间：{{item.etime}}</span>
                </div>
            </div>
            <div class='loadingMore' v-show='isLoadingMore'>正在加载。。。</div>
            <div class='loadingMore' v-show='noMore'>没有更多数据</div>
            
            <!-- 为底部被挡住的元素设置一个展位div -->
            <div class='bottom-placeholder'></div>

        </div>

    </div>
</template>
import vue from 'Vue'
import axios from 'axios'
vue.prototype.$axios = axios

<script>
export default{
    name:'seeAllItem',
    data(){
        return{
            etype:'',                                    //存储从首页传过来的当前页面要展示的类型，也是向后台查询时的类型
            itemList:null,
            page:1,                           //当前加载的内容所属的页数,初始值为1   
            searchContent:'',              //顶部搜索框的内容
            timer:null,                      //延时处理搜索框的计时器
            CancelToken:this.$axios.CancelToken,
            cancel:null,                     //受否取消上次axios请求
            mySearchList:null,                //储存查询结果的列表
            isLoadingMore:null,              //是否正在加载更多
            noMore:null                     //是否没有更多可加载数据
        }
    },
    created:function(){
        this.etype = this.$route.query.type;
        var _this = this;
        
        this.$axios.post('/api/film/getAllItem',{'etype':_this.$route.query.type,page:this.page}).then(function( res ){
            _this.itemList = res.data;
            _this.page++;
        }).catch(function(err){
            console.log(err); 
        });
    },
    mounted:function(){
        this.$on('searchhandler',this.searchHandler);
        window.addEventListener('scroll',this.loadMore);
    },
    beforeDestroy:function(){
        window.removeEventListener('scroll',this.loadMore);
    },
    methods:{
        goToDetailPage:function(eno){
            this.$router.push({path:'/detail',query:{eno:eno}});
        },

        loadMore:function(){
            var top = window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop; //被卷起部分的高度
            var windowHeight = document.documentElement.clientHeight;        //窗口大小
            var totalHeight = document.documentElement.scrollHeight;         //总高度
            if(top+windowHeight >= totalHeight){      //已到达底部
                this.isLoadingMore =  true;
                this.noMore = false;
                //this.page++;               
                var _this = this;        
                this.$axios.post('/api/film/getAllItem',{'etype':_this.$route.query.type,page:this.page}).then(function( res ){
                    if(res.data=='-1'){             //没有更多数据可加载
                        _this.isLoadingMore = false;
                        _this.noMore = true;
                    }else{                          //服务器返回了下一页的数据
                        _this.isLoadingMore = false;
                        _this.noMore = false;
                        _this.itemList = _this.itemList.concat(res.data);   //将加载的更多数据追加到数组中
                        _this.page++;
                    }
                }).catch(function(err){
                    console.log(err); 
                });
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
            })
        },

        goToDetail:function(paraEno){//跳转到用户搜索的影片的具体页面
            console.log('click');
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
            console.log('blur');
            this.mySearchList = null;
        }

    },

    beforeRouteEnter(to,from,next){
        if(from.name != 'detail'){//如果不是从详细页面跳转进来
            var isRefresh = sessionStorage.getItem('isRefresh');
            if(isRefresh == '0'){   //如果不是第一次进入该页面
                sessionStorage.setItem('isRefresh',null);
                window.location.reload();
                next();
            }else{
                sessionStorage.setItem('isRefresh','0');
                next();
            }
        }else{
            next();
        }
        
    },
    beforeRouteLeave(to,from,next){
        if(to.name == 'detail'){         //如果是跳转进详细信息页面，则缓存当前页面
            from.meta.keepAlive = true;
        }else{                           //跳转进其他页面则不缓存
            from.meta.keepAlive = false;
        }
        next();        
    }
}
</script>

<style scoped>

.seeAllBody{
    position:relative;
    margin-top:50px;
    margin-bottom:30px;
    width:100%;
    background-color:#fff;
}
.bodyEntireItem{
    width:100%;
    height:120px;
    padding:10px 20px;
    border-bottom:0.5px solid #d3d3d3;
    -moz-box-sizing:border-box;
    -webkit-box-sizing:border-box;
    box-sizing:border-box;
}
.itemImg{
    width:80px;
    height:100px;
    float:left;
}
.rightContent{
    width:80%;
    height:100px;
    margin-left:10px;
}
.rightContent span{
    color:#d3d3d3;
    font-size:12px;
}
.rightContent h3{
    color:#000;
}
</style>