//node 后端服务器入口文件

const userApi = require('./api/userApi');
const filmApi = require('./api/filmApi');
const searchApi = require('./api/searchApi');
const fs = require('fs');                   //文件模块
const path = require('path');
const bodyParser = require('body-parser');        //对post请求的请求体进行解析
const express = require('express');
const app= express();
//header('Access-Control-Allow-Origin:*');//允许所有来源访问  
//header('Access-Control-Allow-Method:POST,GET');//允许访问的方式 　

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//后端api路由
app.use('/api/user',userApi);           //到地址'/api/user'的请求将映射到userApi
app.use('/api/film',filmApi);          //到地址'/api/film'的请求将映射到filmApi
app.use('/api/search',searchApi);          //到地址'/api/search'的请求将映射到searchApi

app.listen(3000);  //监听的端口号
console.log('success listen at port:3000......');