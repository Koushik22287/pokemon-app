<template>
  <div class="container mt-4" v-if="pokemon">
    <h2 class="mb-4 text-capitalize">{{ pokemon.name }} Details</h2>

    <div class="row">
      <div class="col-md-4 text-center">
        <img :src="pokemon.sprites.front_default" alt="Pokemon" class="img-fluid" />
        <p class="mt-3">
          <span class="badge bg-primary fs-6">#{{ pokemon.id }}</span>
        </p>
      </div>

      <div class="col-md-8">
        <form @submit.prevent="saveChanges">
          <div class="mb-3">
            <label class="form-label">Name (Editable)</label>
            <input v-model="editedName" class="form-control" />
          </div>

          <div class="mb-3">
            <label class="form-label">Height</label>
            <input :value="pokemon.height" class="form-control" disabled />
          </div>

          <div class="mb-3">
            <label class="form-label">Weight</label>
            <input :value="pokemon.weight" class="form-control" disabled />
          </div>

          <div class="mb-3">
            <label class="form-label">Type</label>
            <input
              :value="pokemon.types.map((t) => t.type.name).join(', ')"
              class="form-control"
              disabled
            />
          </div>

          <button type="submit" class="btn btn-success">Save</button>
          <button class="btn btn-secondary ms-2" @click="goBack">Back</button>
        </form>
      </div>
    </div>
  </div>

  <Loader v-else />
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import { usePokemonStore } from '../store/pokemonStore'
import { computed, onMounted, ref } from 'vue'
import Loader from '../components/Loader.vue'

export default {
  components: { Loader },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = usePokemonStore()

    const name = route.params.name
    const editedName = ref('')

    const pokemon = computed(() => store.getPokemonByName(name))

    onMounted(async () => {
      if (!pokemon.value) {
        await store.fetchPokemonList()
      }
      if (pokemon.value) {
        editedName.value = pokemon.value.name
      }
    })

    const saveChanges = () => {
      if (pokemon.value) {
        store.editPokemonName(pokemon.value.id, editedName.value)
        alert('Saved!')
        router.push('/')
      }
    }

    const goBack = () => router.push('/')

    return { pokemon, editedName, saveChanges, goBack }
  }
}
</script>
