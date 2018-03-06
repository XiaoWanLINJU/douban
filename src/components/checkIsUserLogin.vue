<template>
    <div>
        <div class='isLoginWrapper'>
            <p class='isLoginWelcome'>{{username}},欢迎来到豆办</p>
            <input type='button' value='退出' class='logoutBtn' @click='logout'>
        </div>
    
        <modal v-if='showModal'>
            <p slot='title'>提示</p>
            <p slot='content'>确定要退出吗?</p>
            <button slot='btnLeft' @click='sure'>确定</button>
            <button slot='btnRight' @click='cancel' id='rightBtn'>取消</button>
        </modal>
    </div>
</template>

<script>
import axios from 'axios'
import vue from 'vue'
vue.prototype.$axios = axios
import modal from './modal'

export default{
    data(){
        return{
            username:'',
            showModal:false  
        }
    },
    components:{modal},

    created:function(){
        var _this = this;
        //检测用户是否登陆，若登陆则显示用户姓名，否则跳转至登陆界面
        this.$axios.get('/api/user/getSessionName').then(function(res){
            if(res.data==-1){//没有登陆
                _this.$router.push({path:'/userAuthority/goToLogin'});
            }else{
                _this.username = res.data.sessionname;
                console.log(res.data.sessionid);
            }
        }).catch(function(err){
            console.log(err);
        });
    },

    methods:{
        //退出登陆
        logout:function(){
            this.showModal = true;
        },

        //取消退出登陆
        cancel:function(){
            this.showModal = false;
        },

        //确定退出登陆
        sure:function(){
            this.showModal = false;

            var _this = this;
            this.$axios.post('/api/user/logout').then(function(res){
                if(res.data == 1){
                    _this.$router.push({path:'/userAuthority/goToLogin'});
                }else{
                    alert('出错，请稍后重试');
                    return false;
                }
            }).catch(function(err){
                console.log(err);
            });
        }
    }
}
</script>

<style>
.isLoginWrapper{
    width:80%;
    margin:0 auto;
    margin-top:40px;
}
.isLoginWelcome{
    width:100%;
    font-size:16px;
    color:#d3d3d3;
    text-align:center;
    
}
.logoutBtn{
    width:100%;
    height:30px;
    background-color:#00bb00;
    color:#fff;
    margin-top:10px;
    border:none;
    outline:none;
    border-radius:4px;
}
</style>