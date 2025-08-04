import { defineStore } from 'pinia'
import axios from 'axios'

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    allPokemon: [],
    filteredPokemon: [],
    selectedPokemon: null,
    loading: false,
    error: null,
    currentPage: 1,
    itemsPerPage: 10,
    searchTerm: ''
  }),

  getters: {
    paginatedPokemon(state) {
      const start = (state.currentPage - 1) * state.itemsPerPage
      return state.filteredPokemon.slice(start, start + state.itemsPerPage)
    },
    totalPages(state) {
      return Math.ceil(state.filteredPokemon.length / state.itemsPerPage)
    }
  },

  actions: {
    async fetchPokemonList(limit = 100) {
      this.loading = true
      this.error = null
      try {
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`)
        const pokemonList = res.data.results

        const detailedPokemon = await Promise.all(
          pokemonList.map(pokemon => axios.get(pokemon.url).then(res => res.data))
        )

        this.allPokemon = detailedPokemon
        this.filteredPokemon = detailedPokemon
      } catch (error) {
        this.error = 'Failed to load Pokémon data.'
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    filterPokemonByName(search) {
      this.searchTerm = search
      this.currentPage = 1
      this.filteredPokemon = this.allPokemon.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    },

    goToPage(page) {
      this.currentPage = page
    },

    selectPokemonByName(name) {
      this.selectedPokemon = this.allPokemon.find(p => p.name === name)
    },

    updatePokemonInfo(name, updatedData) {
      const index = this.allPokemon.findIndex(p => p.name === name)
      if (index !== -1) {
        this.allPokemon[index] = { ...this.allPokemon[index], ...updatedData }

        const filteredIndex = this.filteredPokemon.findIndex(p => p.name === name)
        if (filteredIndex !== -1) {
          this.filteredPokemon[filteredIndex] = { ...this.filteredPokemon[filteredIndex], ...updatedData }
        }

        if (this.selectedPokemon?.name === name) {
          this.selectedPokemon = { ...this.selectedPokemon, ...updatedData }
        }
      }
    }
  }
})
