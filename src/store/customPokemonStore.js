// src/store/customPokemonStore.js
import { defineStore } from 'pinia'

export const useCustomPokemonStore = defineStore('customPokemon', {
  state: () => ({
    customPokemonData: {}  // store custom data by pokemon name
  }),
  actions: {
    updateCustomInfo(name, data) {
      this.customPokemonData[name] = data
    }
  }
})
