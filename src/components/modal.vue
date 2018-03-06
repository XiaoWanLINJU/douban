<template>
    <transition name='modal'>
        <div class='modal-mask'>

            <div class='modalWrapper'>
                <!-- 标题部分 -->
                <div class='modalTitle'>
                    <slot name='title'>default title</slot>
                </div>

                <!-- 中间提示文字部分 -->
                <div class='modalContent'>
                    <slot name='content'>default content</slot>
                </div>

                <!-- 底部按钮部分 -->
                <div class='modalFooter'>
                    <slot name='btnLeft'>default sure</slot>
                    <slot name='btnRight' id='rightBtn'></slot>
                </div>
            </div>

        </div>
    </transition>
</template>

<script>
export default{
    data(){
        return{
        }
    }
}
</script>

<style>
.modal-mask{
    position:fixed;
    z-index:1000;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background-color:#d3d3d3;
    transition:opacity 0.3s ease;
}
.modalWrapper{
    width:80%;
    margin:100px auto;
    background-color:#fff;
    border-radius:2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    border:0.7px solid #d3d3d3;
}
.modalTitle{
    width:100%;
    height:30px;
    background-color:#00bb00;
    color:#fff;
    text-align:center;
    padding-top:5px;
}
.modalTitle p{
    display:block;
}
.modalContent{
    width:100%;
    height:50px;
    padding:20px 30px;
    text-align:left;
}
.modalContent p{
    font-size:15px;
    color:#000;
}
.modalFooter{
    width:100%;
    height:30px;
    border-top:0.7px solid #d3d3d3;
    font-size:15px;
    color:#000;
    text-align:center;
}
.modalFooter button{
    height:100%;
    width:49%;
    margin:0 auto;
    border:none;
    background-color:#fff;
    outline:none;
}
#rightBtn{
    border-left:0.7px solid #d3d3d3;
}
</style>