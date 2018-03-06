<template>
    <div class='outer-box'>

        <!-- 选择图片左右滑动的按钮以及点击查看详细列表按钮 -->
        <div class='top-banner-en'>
            <div class='slideBtnWrapper'>
                <input type='button' class='filmSlideBtn' value='<' @click='slideToLeft'>
                <input type='button' class='filmSlideBtn' value='>' @click='slideToRight'>
            </div>
            <div class='checkMore'><a @click='goToCheckMore'>查看更多></a></div>
        </div>
        
        <div class='showPicture'>
            

            <div class='innerSlide'>
                <!-- 三个录播图片模块中的左边 -->
                <div class='slidediv'>
                    <transition-group tag="ul" :name="imageleft">  
                        <li v-for='(item,index) in filmItem' v-if='index===markLeft' :key='index'>
                            <a @click='goToDetail(item.id)'>
                                <img :src="require('../../static/entertainimg/'+item.eimage)">
                                <span class='itemNameSpan'>{{item.ename}}</span> 
                            </a>
                        </li>
                    </transition-group>
                </div>

                <!-- 三个录播图片模块中的中间 -->
                <div class='slidediv'>
                    <transition-group tag="ul" :name="imagemiddle">  
                        <li v-for='(item,index) in filmItem' v-if='index===markMiddle' :key='index'>
                            <a @click='goToDetail(item.id)'>
                                <img :src="require('../../static/entertainimg/'+item.eimage)">
                                <span class='itemNameSpan'>{{item.ename}}</span> 
                            </a>
                        </li>
                    </transition-group>
                </div>

                <!-- 三个录播图片模块中的右边 -->
                <div class='slidediv'>
                    <transition-group tag="ul" :name="imageright" mode='out-in'> 
                        <li v-for='(item,index) in filmItem' v-if='index===markRight' :key='index'>
                            <a @click='goToDetail(item.id)'>
                                <img :src="require('../../static/entertainimg/'+item.eimage)">
                                <span class='itemNameSpan'>{{item.ename}}</span> 
                            </a>
                        </li>
                    </transition-group>
                </div>

            </div>
            
        </div>
    </div>
</template>

<script>
export default{
    props:['movies'],
    data(){
        return{
            filmItem:[],
            markLeft:0,
            markRight:2,
            markMiddle:1,
            imageleft:'',
            imageright:'',
            imagemiddle:'',
            etype:''
            
        }
    },
    mounted:function(){
            var _this = this;
            for(var i=0;i<_this.movies["0"].length;i++){
                _this.filmItem.push({id:_this.movies[0][i].eno,ename:_this.movies[0][i].ename,eimage:_this.movies[0][i].eimage});
            }
            this.etype = this.movies[0][0].etype;
            window.addEventListener('scroll',this.handleScroll);
    },
    destroy:function(){
        window.removeEventListener('scroll',this.handleScroll);
    },
    methods:{
        slideToLeft:function(){
            this.imageleft = 'transition-to-left-left';
            this.imageright = 'transition-to-left-right';
            this.imagemiddle = 'transition-to-left-middle';
            var lengthOfPicture = this.filmItem.length-1;
            if(this.markLeft === 0){
                this.markLeft = lengthOfPicture;
            }else{
                this.markLeft--;
            }
            if(this.markMiddle === 0){
                this.markMiddle = lengthOfPicture;
            }else{
                this.markMiddle--;
            }
            if(this.markRight === 0){
                this.markRight = lengthOfPicture;
            }else{
                this.markRight--;
            }
        },
        slideToRight:function(){
            this.imageleft = 'transition-to-right-left';
            this.imageright = 'transition-to-right-right';
            this.imagemiddle = 'transition-to-right-middle';
            var lengthOfPicture = this.filmItem.length-1;
            if(this.markLeft === lengthOfPicture){
                this.markLeft = 0;
            }else{
                this.markLeft++;
            }
            if(this.markMiddle === lengthOfPicture){
                this.markMiddle = 0;
            }else{
                this.markMiddle++;
            }
            if(this.markRight === lengthOfPicture){
                this.markRight = 0;
            }else{
                this.markRight++;
            }
        },
        goToCheckMore:function(){
            this.$router.push({path:'/seeAllItem',query:{type:this.etype}});
        },
        handleScroll:function(){
            var scrollTop = window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop;
            var getOuterHeight = 200;
            if(scrollTop<getOuterHeight){
                this.$emit('scrollEvent','1');
            }else if(scrollTop<getOuterHeight * 2){
                this.$emit('scrollEvent','2');
            }else if(scrollTop<getOuterHeight * 3){
                this.$emit('scrollEvent','3');
            }else{
                this.$emit('scrollEvent','4');
            }
        },
        goToDetail:function(eno1){
            this.$router.push({path:'/detail',query:{eno:eno1}});
        }
    },

    
        
}
</script>
export default{

}
<style>
.outer-box{
    width:100%;
    background-color:#fff;
    margin:10px 0 0;
    border-radius:2px;
}
.top-banner-en{
    width:100%;
    height:30px;
    display:flex;
    padding:0 10px;
    justify-content:space-between;
    align-items:center;
    border-bottom:0.5px solid #00bb00;
    -moz-box-sizing:border-box;
    -webkit-box-sizing:border-box;
    box-sizing:border-box;
}
.checkMore{
    width:70px;
    height:25px;
    font-size:14px;
    margin-right:20px;
}
.slideBtnWrapper{
    height:25px;
}
.filmSlideBtn{
    width:20px;
    height:20px;
    font-size:15px;
    border:none;
    background-color:#00bb00;
    color:#fff;
    border-radius:4px;
    opacity:0.5;
    outline:none;
}
.showPicture{
    width:100%;
    display:flex;
    justify-content:space-around;
    align-items:center;
    padding-top:5px;
}
.innerSlide{
    width:315px;
    height:180px;
    overflow:hidden;
    display:flex;
    flex-flow:row  wrap;
    justify-content:space around;
    padding-top:10px;
    margin:0 auto
}
.slidediv{
    position:relative; 
    width:105px;
    height:180px;
}

li{
    list-style-type:none;
    position:absolute;
    width:105px;
    height:180px;
}
img{
    width:105px;
    height:140px;
}
.itemNameSpan{
    font-size:14px;
    color:#000;
}

.transition-to-right-left-enter-active {  
    transform: translateX(0);  
    transition: all 1s ease; 
    opacity:0.9; 
  }  
.transition-to-right-left-leave-active {  
    transform: translateX(-100%);  
    transition: all 1s ease;  
    opacity:0.5;
}  
.transition-to-right-left-enter {  
    transform: translateX(100%);  
  }  
.transition-to-right-left-leave {  
    transform: translateX(0);  
}  

.transition-to-right-right-enter-active {  
    transform: translateX(0);  
    transition: all 1s ease;  
    opacity:0.9;
  }  
.transition-to-right-right-leave-active {  
    transform: translateX(-100%);  
    transition: all 1s ease; 
    opacity:0.5; 
}  
.transition-to-right-right-enter {  
    transform: translateX(100%);  
  }  
.transition-to-right-right-leave {  
    transform: translateX(0);  
}  


.transition-to-right-middle-enter-active {  
    transform: translateX(0);  
    transition: all 1s ease; 
    opacity:0.9; 
  }  
.transition-to-right-middle-leave-active {  
    transform: translateX(-100%);  
    transition: all 1s ease;  
    opacity:0.5;
}  
.transition-to-right-middle-enter {  
    transform: translateX(100%);  
  }  
.transition-to-right-middle-leave {  
    transform: translateX(0);  
}  

.transition-to-left-middle-enter-active {  
    transform: translateX(0);  
    transition: all 1s ease;  
    opacity:0.9;
  }  
.transition-to-left-middle-leave-active {  
    transform: translateX(100%);  
    transition: all 1s ease; 
    opacity:0.5; 
}  
.transition-to-left-middle-enter {  
    transform: translateX(-100%);  
  }  
.transition-to-left-middle-leave {  
    transform: translateX(0);  
}  


.transition-to-left-left-enter-active {  
    transform: translateX(0);  
    transition: all 1s ease; 
    opacity:0.9; 
  }  
.transition-to-left-left-leave-active {  
    transform: translateX(100%);  
    transition: all 1s ease;  
    opacity:0.5;
}  
.transition-to-left-left-enter {  
    transform: translateX(-100%);  
  }  
.transition-to-left-left-leave {  
    transform: translateX(0);  
}  

.transition-to-left-right-enter-active {  
    transform: translateX(0);  
    transition: all 1s ease;  
    opacity:0.9;
  }  
.transition-to-left-right-leave-active {  
    transform: translateX(100%);  
    transition: all 1s ease; 
    opacity:0.5; 
}  
.transition-to-left-right-enter {  
    transform: translateX(-100%);  
  }  
.transition-to-left-right-leave {  
    transform: translateX(0);  
}  
</style>