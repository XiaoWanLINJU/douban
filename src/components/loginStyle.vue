<template>
    <div>

        <!-- 登陆框 -->
        <div class='user-outer' v-if='showLogin'>
            <div class='input-outer'>
                <input type='text' v-model='loginUserName' class='user-input' placeholder='用户名'>
                <hr></hr>
                <input type='password' v-model='loginPwd' class='user-input' placeholder='密码'>
            </div>
            <input type='button' @click='goToLogin' class='user-button' value='登陆'>
            </br>
            <span class='user-span'>没有账号？<a @click='isToShowBlock'>点击这里</a></span>
        </div>

        <!-- 注册框 -->
        <div class='user-outer' v-if='showRegister'>
            <div class='input-outer'>
                <input type='text' v-model='createUserName' class='user-input' placeholder='用户名'>
                <hr></hr>
                <input type='password' v-model='createUserPwd' class='user-input' placeholder='密码'>
                <hr></hr>
                <input type='password' v-model='createDoubleCheckPwd' class='user-input' placeholder='确认密码'>
            </div>
            <input type='button' @click='goToRegister' class='user-button' value='注册'>
            </br>
            <span class='user-span'>已有账号？<a @click='isToShowBlock'>点击这里</a></span>
        </div>

        <!-- 弹出提示框 -->
        <modal v-if='showModal'>
            <p slot='title'>提示</p>
            <p slot='content'>{{tipsInfo}}</p>
            <button slot='btnLeft' @click='closeModal'>确定</button>
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
            showLogin:true,                 //控制是否显示登陆模块
            showRegister:false,             //控制是否显示注册模块
            loginUserName:'',                 //登陆框的用户名
            loginPwd:'',                       //登陆框的密码
            createUserName:'',               //注册框的用户名
            createUserPwd:'',                //注册框的密码
            createDoubleCheckPwd:'',          //注册框的确认密码
            tipsInfo:null,                    //将要显示的提示信息的排序号
            showModal:false                  //是否显示提示框
        }
    },
    components:{modal},
    methods:{
        
        //切换登陆框与注册框
        isToShowBlock:function(){
            this.showLogin = !this.showLogin;
            this.showRegister = !this.showRegister;
        },

        //判断当前要显示的提示框的文字
        operateModal:function(index){
            switch(index){
                case 1:this.tipsInfo = '请输入用户名和密码';break;
                case 2:this.tipsInfo = '该用户名不存在';break;
                case 3:this.tipsInfo = '密码错误';break;
                case 4:this.tipsInfo = '欢迎登陆';break;
                case 5:this.tipsInfo = '请输入完整的信息';break;
                case 6:this.tipsInfo = '请确认您的密码';break;
                case 7:this.tipsInfo = '该用户已存在';break;
                case 8:this.tipsInfo = '注册成功';break;
                default :this.tipsInfo = null;
            }
            this.showModal = true;
        },

        //关闭提示框
        closeModal:function(){
            this.showModal = false;
            if(this.tipsInfo =='欢迎登陆' || this.tipsInfo =='注册成功'){
                this.$router.go(-1);
            }
        },
        
        goToLogin:function(){    //登陆请求
            if(!this.loginUserName||!this.loginPwd){  //请求框没有输入完整
                this.operateModal(1);
                return false;
            }else{
                var _this = this;
                var loginData = {'username':this.loginUserName,'password':this.loginPwd};

                this.$axios.post('/api/user/queryUser',loginData).then(function(res){

                    if(res.data==-1){                //用户名不存在
                        _this.loginUserName = '';
                        _this.loginPwd = '';
                        _this.operateModal(2);
                    }else if(res.data==0){          //密码错误
                        _this.loginPwd = '';
                        _this.operateModal(3);
                    }else if(res.data==1){          //登陆成功
                        _this.operateModal(4);
                    }
                }).catch(function(err){
                    console.log(err);
                });

            }
        },

        //注册操作
        goToRegister:function(){
            if(!this.createUserName||!this.createUserPwd||!this.createDoubleCheckPwd){  //输入信息不完整
                this.operateModal(5);
                return false;
            }else if(this.createUserPwd!=this.createDoubleCheckPwd){              //两次密码不相同
                this.createUserPwd = '';
                this.createDoubleCheckPwd = '';
                this.operateModal(6);
                return false;
            }else{
                var _this = this;
                var createUser = {'username':this.createUserName,'password':this.createUserPwd};

                this.$axios.post('/api/user/addUser',createUser).then(function(res){
                    if(res.data==0){                                        //该用户名已被注册
                        _this.operateModal(7);
                        _this.createUserName = '';
                        return false;
                    }else if(res.data==1){                             //注册成功
                        _this.operateModal(8);
                        _this.createUserName = '';
                        _this.createUserPwd = '';
                        _this.createDoubleCheckPwd = '';
                    }
                }).catch(function(err){
                    console.log(err);
                });
                
            }
        }

    }
}
</script>

<style>
.user-outer{
    padding-top:40px;
    width:100%;
    margin-bottom:40px; 
}
.input-outer{
    width:94%;
    border:1px solid #d3d3d3;
    margin:10px auto;
    border-radius:5px;
}
.user-input{
    width:95%;
    height:30px;
    border:none;
    text-align:right;
    color:#d3d3d3;
    padding-right:15px;
    border-radius:5px;
    font-size:15px;
}
.user-button{
    margin:0 auto;
    width:74%;
    background-color:#00bb00;
    outline:none;
    color:#fff;
    border:none;
    height:30px;
    border-radius:5px;
}
.user-span{
    font-size:12px;
}
.user-span a{
    pointer:cursor;
}
hr{
    background-color:#d3d3d3;
    height:0.7px;
    border:none;
}
</style>