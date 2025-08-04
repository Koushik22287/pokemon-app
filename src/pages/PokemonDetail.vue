<template>
  <div class="container py-4">
    <button @click="router.back()" class="btn btn-secondary mb-3">← Back</button>

    <div v-if="pokemon">
      <h3>{{ capitalize(pokemon.name) }}</h3>
      <img :src="pokemon.sprites.front_default" alt="sprite" />

      <p><strong>Types:</strong> {{ pokemon.types.map(t => t.type.name).join(', ') }}</p>

      <hr />
      <h5>Edit Custom Info</h5>
      <form @submit.prevent="saveChanges">
        <div class="mb-2">
          <label class="form-label">Nickname:</label>
          <input v-model="nickname" class="form-control" />
        </div>
        <div class="mb-2">
          <label class="form-label">Notes:</label>
          <textarea v-model="notes" class="form-control"></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Save</button>
      </form>

      <div class="mt-3">
        <h6>Stored Info:</h6>
        <p><strong>Nickname:</strong> {{ customStore.customPokemonData[pokemon.name]?.nickname || 'N/A' }}</p>
        <p><strong>Notes:</strong> {{ customStore.customPokemonData[pokemon.name]?.notes || 'N/A' }}</p>
      </div>
    </div>

    <Loader v-else />
  </div>
</template>

<script>
import { usePokemonStore } from '../store/pokemonStore'
import { useCustomPokemonStore } from '../store/customPokemonStore'
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref, computed, watch } from 'vue'
import Loader from '../components/Loader.vue'

export default {
  components: { Loader },
  setup() {
    const store = usePokemonStore()
    const customStore = useCustomPokemonStore()
    const route = useRoute()
    const router = useRouter()

    const name = route.params.name

    const pokemon = computed(() =>
      store.allPokemon.find(p => p.name === name)
    )

    const nickname = ref('')
    const notes = ref('')

    // Fetch Pokémon if not loaded yet
    onMounted(() => {
      if (!store.allPokemon.length) {
        store.fetchPokemonList()
      }
    })

    // Load custom info
    watch(
      () => pokemon.value,
      (newVal) => {
        if (newVal) {
          const custom = customStore.customPokemonData[name] || {}
          nickname.value = custom.nickname || ''
          notes.value = custom.notes || ''
        }
      },
      { immediate: true }
    )

    // Save changes to custom store
    const saveChanges = () => {
      customStore.updateCustomInfo(name, {
        nickname: nickname.value,
        notes: notes.value
      })
      alert('Custom info saved!')
    }

    const capitalize = (value) => {
      if (!value) return ''
      return value.charAt(0).toUpperCase() + value.slice(1)
    }

    return {
      pokemon,
      nickname,
      notes,
      saveChanges,
      customStore,
      router,
      capitalize
    }
  }
}
</script>

<style scoped>
img {
  width: 150px;
}
</style>
