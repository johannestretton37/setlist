import VueRouter from 'vue-router'
import Start from './components/Start.vue'
import Login from './components/Login.vue'

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: Start },
    { path: '/login', component: Login }
    //    { path: '/success', component: AuthSuccess }
  ]
})
export default router
