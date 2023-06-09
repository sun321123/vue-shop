import { createRouter, createWebHashHistory } from 'vue-router'
import LayOut from '../views/LayOut/LayOut' 
import Login from "../views/pages/login.vue"
import store from "@/store/index.js"
const routes = [
  {
    path:"/login",
    name:"login",
    component:Login
  },
  {
    path:"/",
    name:"layout",
    component:LayOut,
    redirect:"/index",
    // 子路由/嵌套路由
    children:[
      {
        path:"/index",
        name:"index",
        component:()=>import("../views/pages/index.vue")
      }, 
      {
        path:"/roles",
        name:"roles",
        component:()=>import("../views/pages/rolesList.vue")
      },
    
      {
        path:"/user",
        name:"user",
        component:()=>import("../views/pages/usersList.vue")
      },
      {
        path:"/goods",
        name:"goods",
        component:()=>import("../views/pages/goodsList.vue")
      },
   
    ]
  },

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
router.beforeEach((to,from,next)=>{
  /**
   * to:从哪个页面
   * from:到哪个页面
   * next:只有执行next()页面才会进行跳转
   */
  // 判断用户是否登录
  // console.log("store",store.state.uInfo)
  // console.log(to,from,next)
  const uInfo = store.state.uInfo.userInfo  
  if(!uInfo.username){ 
    // 未登录,跳转到login 
    if(to.path==="/login"){
      next()
      return
    }
    next("/login")

  }else{

    next()
  }

})
export default router
