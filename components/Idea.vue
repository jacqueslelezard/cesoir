<template>
  <transition name="fade" mode="out-in">
    <div class="idea">
      <div class="card-max">
        <div class="card-image">
          <div class="card-header">
            <img
              class="favButton"
              :class="{
                disabledFavButton: !favoriteMovies.includes(
                  movieIdea.id.toString()
                )
              }"
              src="./../static/star.svg"
              @click="toggleFavorite(movieIdea.id)"
            />
            <p class="title is-3">
              {{ movieIdea.title }} ({{ movieIdea.release_date.split('-')[0] }})
            </p>
          </div>
          <div class="card-main">
            <figure
              :key="posterUrl"
              class="image is-5by4"
              :style="{
                backgroundImage: posterUrl
              }"
            ></figure>
            <div class="content">
              {{ movieIdea.overview }}
            </div>
          </div>
          <div
            class="blurred-bg"
            :style="{
              backgroundImage: posterUrl
            }"
          ></div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    movieIdea: {
      type: Object,
      required: true
    },
    favoriteMovies: {
      type: Array,
      required: true
    }
  },
  computed: {
    posterUrl() {
      return (
        'url(https://image.tmdb.org/t/p/w600_and_h900_bestv2/' +
        this.movieIdea.poster_path +
        ')'
      )
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
.card-max {
  width: 90%;
  height: 90vh;
  margin: 5%;
  overflow: auto;
  scrollbar-color: #eee #fff;
  scrollbar-width: thin;
  max-height: 100vh;
  background-color: rgba(255, 255, 255, 0.8);

  .blurred-bg {
    position: absolute;
    top: 0;
    left: 0;
    filter: blur(10px);
    width: 100%;
    height: 100%;
    z-index: -1;
  }

  .card-image {
    flex-direction: column;
    display: flex;

    .card-header {
      padding: 10px;
      margin: 0;
      z-index: 1;
      .title {
        margin: 0;
        padding: 0;
        margin-left: 10px;
      }
      .favButton {
        width: 40px;
        height: 40px;
        cursor: pointer;
      }
      .disabledFavButton {
        filter: grayscale(100%);
      }
    }

    .card-main {
      display: flex;
      align-items: center;
      flex-direction: column;

      figure,
      .content {
        width: 80%;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }

      .content {
        width: 100%;
        padding: 3%;
      }

      figure {
        margin-top: 10px;
        animation: 1.5s appear ease;
      }
    }
  }

  @keyframes appear {
    0% {
      clip-path: circle(5%);
      transform: scale(1.1);
    }
    100% {
      clip-path: circle(100%);
      transform: scale(1);
    }
  }
}
</style>
