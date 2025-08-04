import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './pages/HomePage.vue'
import PokemonDetail from './pages/PokemonDetail.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/pokemon/:name', component: PokemonDetail }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
