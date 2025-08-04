<template>
  <div class="card h-100 shadow-sm text-center">
    <img
      :src="pokemon.sprites.front_default"
      alt="Pokemon Image"
      class="card-img-top p-3"
    />
    <div class="card-body">
      <h5 class="card-title text-capitalize">{{ pokemon.name }}</h5>
      <p class="card-text">
        Type: {{ pokemon.types[0]?.type.name }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PokemonCard',
  props: {
    pokemon: Object
  }
}
</script>
