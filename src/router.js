import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Data from './views/data.vue'
import DataStructure from './views/data-structure.vue'
import Welcome from './views/Welcome.vue'
import Test from './views/test.vue'
import Create from './views/create.vue'
import Virtual from './views/virtual.vue'
import Navbar from './views/navbar.vue'
import UserList from './components/users/UserList.vue'
import UserDetail from './components/users/UserDetail.vue'



const routes = [


  {
    path:'/',
    redirect: '/welcome',
  },



  {
    path: '/navbar',
    component: Navbar,
    children: [
      {
        path: '/home',
        component: Home,
        redirect: '/welcome',
        children: [
          { path: '/data-stress', component: Data },
          { path: '/data-structure', component: DataStructure },
          { path: '/welcome', component: Welcome },
          { path: '/test', component: Test },
          { path: '/create', component: Create},
          { path: '/virtual', component: Virtual },
          { path: '/users', component: UserList},
          { path: '/users/:id', component: UserDetail, props: true}
        ]
      },
    ]
  },
 
]

const router = createRouter({
  routes,
  history: createWebHistory(process.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 } 
  }
})

export default router
