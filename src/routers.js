import mainComponent from './components/mainComponent'
import userComponent from './components/userComponent'
import userIsLogin from './components/checkIsUserLogin'
import userGoToLogin from './components/loginStyle'
import checkAllItem from './components/checkAllItem'
import detailPage from './components/certainFilmDetail'

const routers = [
    {
        path:'/',
        redirect:'/main',
        meta:{
            keepAlive:false
        }
    },
    {
        path:'/main',
        name:'mainPage',
        component:mainComponent,
        meta:{
            keepAlive:false
        }
    },
    {
        path:'/userAuthority',
        name:'userPage',
        component:userComponent,
        meta:{
            keepAlive:false
        },
        children:[
            {
                path:'checkUserLogin',
                component:userIsLogin,
                meta:{
                    keepAlive:false
                }
            },
            {
                path:'goToLogin',
                component:userGoToLogin,
                meta:{
                    keepAlive:false
                }
            }
        ]  
    },
    {
        name:'seeAllItem',
        path:'/seeAllItem',
        component:checkAllItem,
        meta:{
            keepAlive:false
        }
    },
    {
        name:'detail',
        path:'/detail',
        component:detailPage,
        meta:{
            keepAlive:false
        }
    }
]
export default routers