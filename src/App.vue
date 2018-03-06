<template>
  <div id="app">

  <keep-alive>
    <transition :name='slideto'>
      <router-view v-if='$route.meta.keepAlive' class='main-view'></router-view>
    </transition>
  </keep-alive>
  <transition :name='slideto'>
    <router-view v-if='!$route.meta.keepAlive' class='main-view'></router-view>
  </transition>

    

    <!-- 底部固定首页登陆页切换按钮 -->
    <div class='footer'>
      <div class='footer-wrapper'>
        <div class='footer-span'>
          <a @click='goToMain' :class='{atCuurentPage: this.$route.path.indexOf("/userAuthority")==-1}'>
            <img src='./assets/main.jpg' class='footer-icon'><div class='footer-block'>书影音</div>
          </a>
        </div>
        <div class='footer-span'>
          <a @click='goToUser' :class='{atCuurentPage: this.$route.path.indexOf("/userAuthority")!=-1}'>
            <img src='./assets/user.jpg' class='footer-icon'><div class='footer-block'>登陆</div>
          </a>
        </div>
      </div>
    </div>

  </div>
</template>

<script>


export default {
  name: 'App',
  data(){
    return{
      atMain:true,
      slideto:'slide-left'
    }
  },
  components: {
  },

  watch:{
    '$route'(to,from){
      if(to.path == '/main'){   //切换到首页
        this.slideto = 'slide-right';
      }else if(to.path == '/userAuthority/checkUserLogin' || to.path == '/userAuthority/goToLogin' || to.path == '/detail'){
        //切换到登陆页面或详细页面
        this.slideto = 'slide-left';
      }else if(from.path == '/main' && to.path == '/seeAllItem'){
        //从首页切换到类型列表页
        this.slideto = 'slide-left';
      }else if(from.path == '/detail' && to.path == '/seeAllItem'){//从详细页切换到类型列表页
        this.slideto = 'slide-right';
      }
    }
  },

  mounted:function(){
  },
  methods:{
    goToMain:function(){
      this.$router.push({path:'/main'});
    },
    goToUser:function(){
      this.$router.push({path:'/userAuthority/checkUserLogin'});
    }
  }
}
</script>

<style>
*{
  margin:0;
  padding:0;
}
html,body,#app,.wrapper,.seeAllBody{
  height:100%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  top:0;
  left:0;
  width:100%;
  position:relative;
}
.footer{
  position:fixed;
  bottom:0;
  left:0;
  width:100%;
  border-top:1px #d3d3d3 solid;
  height:30px;
  z-index:999;
  background-color:#fff;
}
.footer-wrapper{
  display:flex;
  justify-content:space-around;
  align-items:center;
}
.footer-span{
  width:28px;
  height:28px
}
.footer-icon{
  max-width:10px;
  max-height:10px;
}
.footer-block{
  font-size:8px;
}
a{
  text-decoration:none;
  color:#d3d3d3;
}
.atCuurentPage{
  color:#00bb00;
}
.main-view{
  position:absolute;
  width:100%;
  top:0;
  left:0;
  transition: all .5s cubic-bezier(.55,0,.1,1);
  -moz-box-sizing:border-box;
  -webkit-box-sizing:border-box;
  box-sizing:border-box;
}
.slide-left-enter,.slide-right-leave-active{
  opacity:0;
  transform:translate(30px,0);
}
.slide-right-enter,.slide-left-leave-active{
  opacity:0;
  transform:translate(-30px,0);
}
li{
    list-style-type:none;
}

/**顶部搜索栏**/
.wrapper{
    background-color:#d3d3d3;
    padding-bottom:30px;
    width:100%;
}
.top-banner{
    top:0;
    position:fixed;
    width:100%;
    height:40px;
    background-color:#00bb00;
    z-index:2;
}
.sreach{
    top:5px;
    width:100%;
    position:absolute;
    align-items:center;
    overflow:visible;
}
.search-input{
    width:70%;
    height:28px;
    border:none;
    border-radius:5px;
    display:block;
    text-align:right;
    margin:0 auto;
    outline:none;
    padding-right:8px;
    color:#d3d3d3;
}
.seUlDiv{
    width:100%;
    position:absolute;
    top:28px;
    z-index:3; 
}
.searchUl{
    width:70%;
    border:0.7px solid #d3d3d3;
    border-bottom:none;
    background-color:#fff;
    margin:0 auto;
    
}
.wordList{
    width:100%;
    height:25px;
    text-align:right;
    font-size:15px;
    border-bottom:0.7px solid #d3d3d3;
    z-index:3;
    color:#000;
    position:relative;
    cursor:pointer;
}
/*搜索栏结束*/

.set-box-border{
  -moz-box-sizing:border-box;
  -webkit-box-sizing:border-box;
  box-sizing:border-box;
}

/*底部占位div*/
.bottom-placeholder{
  height:30px;
  width:100%;
}
</style>
