<template>
  <div class="container mt-4">
    <h2 class="text-center mb-4">Pokémon Explorer</h2>

    <!-- Search Bar -->
    <input
      v-model="search"
      type="text"
      class="form-control mb-3"
      placeholder="Search Pokémon by name..."
    />

    <!-- Loader -->
    <Loader v-if="store.loading" />

    <!-- Grid Display -->
    <div class="row">
      <div
        class="col-md-4 col-sm-6 mb-4"
        v-for="pokemon in paginatedFilteredPokemon"
        :key="pokemon.id"
        @click="goToDetail(pokemon.name)"
        style="cursor: pointer"
      >
        <PokemonCard :pokemon="pokemon" />
      </div>
    </div>

    <!-- Pagination -->
    <nav class="d-flex justify-content-center mt-4">
      <ul class="pagination">
        <li
          class="page-item"
          :class="{ disabled: store.currentPage === 1 }"
          @click="store.goToPage(store.currentPage - 1)"
        >
          <a class="page-link" href="#">Prev</a>
        </li>

        <li
          v-for="page in totalPages"
          :key="page"
          class="page-item"
          :class="{ active: store.currentPage === page }"
          @click="store.goToPage(page)"
        >
          <a class="page-link" href="#">{{ page }}</a>
        </li>

        <li
          class="page-item"
          :class="{ disabled: store.currentPage === totalPages }"
          @click="store.goToPage(store.currentPage + 1)"
        >
          <a class="page-link" href="#">Next</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { usePokemonStore } from '../store/pokemonStore'
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import PokemonCard from '../components/PokemonCard.vue'
import Loader from '../components/Loader.vue'

export default {
  components: { PokemonCard, Loader },
  setup() {
    const store = usePokemonStore()
    const search = ref('')
    const router = useRouter()

    // Fetch Pokémon on mount
    onMounted(() => {
      if (!store.allPokemon.length) {
        store.fetchPokemonList()
      }
    })

    // Filtered + Paginated List
    const paginatedFilteredPokemon = computed(() => {
      const filtered = store.allPokemon.filter((p) =>
        p.name.toLowerCase().includes(search.value.toLowerCase())
      )
      const start = (store.currentPage - 1) * store.itemsPerPage
      return filtered.slice(start, start + store.itemsPerPage)
    })

    // Total Pages based on search
    const totalPages = computed(() => {
      const filteredCount = store.allPokemon.filter((p) =>
        p.name.toLowerCase().includes(search.value.toLowerCase())
      ).length
      return Math.ceil(filteredCount / store.itemsPerPage)
    })

    // Navigate to detail page
    const goToDetail = (name) => router.push(`/pokemon/${name}`)

    return {
      store,
      search,
      paginatedFilteredPokemon,
      totalPages,
      goToDetail
    }
  }
}
</script>
