<template>
  <div class="gallery">
    <div
      v-for="movie in displayedMovies"
      :key="movie.id"
      class="card"
      :class="{ fav: favoriteMovies.includes(movie.id.toString()) }"
      @click="toggleFavorite(movie.id)"
    >
      <div class="card-image">
        <figure
          class="image is-3by4"
          :style="{
            backgroundImage:
              'url(https://image.tmdb.org/t/p/w300_and_h450_bestv2/' +
              movie.poster_path +
              ')'
          }"
        ></figure>
      </div>
      <div class="card-content">
        <div class="media">
          <div class="media-content">
            <p class="title is-4">
              <img
                class="favButtonMin"
                :class="{
                  disabledFavButton: !favoriteMovies.includes(
                    movie.id.toString()
                  )
                }"
                src="./../static/star.svg"
                @click="toggleFavorite(movie.id)"
              />{{ movie.title }}
            </p>
            <p class="subtitle is-6">{{ movie.release_date.split('-')[0] }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    displayedMovies: {
      type: Array,
      required: true
    },
    favoriteMovies: {
      type: Array,
      required: true
    }
  },
  methods: {
    toggleFavorite(movieId: string) {
      this.$emit('toggle-favorite', movieId)
    }
  }
})
</script>
<style lang="scss">
.card {
  width: 200px;
  margin: 1%;
  height: auto;
  max-height: 450px;
  overflow: hidden;
  cursor: pointer;
  transition: 0.3s ease-in;
}
</style>
