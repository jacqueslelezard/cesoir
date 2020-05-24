<template>
  <div class="container">
    <div class="header">
      <h1 class="title"><logo /> <span>cesoir</span></h1>

      <h2 class="subtitle">
        Jamais à court d'idée
      </h2>
      <div class="actions">
        <button
          class="button is-primary is-rounded find-button"
          @click="findMovie()"
        >
          Une idée, vite !
        </button>
        <input
          class="input is-rounded search-box"
          type="text"
          placeholder="J'ajoute un film à ma liste à voir"
          v-model="search"
        />
      </div>
    </div>
    <div class="idea" v-if="movieIdea.id">
      <div class="card card-max">
        <div class="card-image">
          <div class="card-header">
            <img
              class="favButton"
              :class="{
                disabledFavButton: !favoriteMovies.includes(
                  movieIdea.id.toString()
                )
              }"
              @click="toggleFavorite(movieIdea.id)"
              src="./../static/star.svg"
            />
            <p class="title is-3">
              {{ movieIdea.title }} ({{ movieIdea.release_date }})
            </p>
          </div>
          <div class="card-main">
            <div
              class="blurred-bg"
              :style="{
                backgroundImage:
                  'url(https://image.tmdb.org/t/p/w600_and_h900_bestv2/' +
                  movieIdea.poster_path +
                  ')'
              }"
            ></div>
            <figure
              class="image is-5by4"
              :style="{
                backgroundImage:
                  'url(https://image.tmdb.org/t/p/w600_and_h900_bestv2/' +
                  movieIdea.poster_path +
                  ')'
              }"
            ></figure>
            <div class="content">
              {{ movieIdea.overview }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="gallery" v-if="search.length">
      <div
        class="card"
        v-for="movie in searchedMovies"
        v-bind:key="movie.id"
        @click="toggleFavorite(movie.id)"
        :class="{ fav: favoriteMovies.includes(movie.id.toString()) }"
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
              <p class="title is-4">{{ movie.title }}</p>
              <p class="subtitle is-6">{{ movie.release_date }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Logo from '~/components/Logo.vue'
import axios from 'axios'

const api_key = '5a8f8a3c5c49b7b09151edb7e144ad4b'

export default Vue.extend({
  components: {
    Logo
  },
  data: function() {
    return {
      search: '' as string,
      movieIdea: {} as any,
      searchedMovies: [] as string[],
      favoriteMovies: [] as string[]
    }
  },
  mounted() {
    const existingFav = localStorage.getItem('favoriteMovies')
    this.favoriteMovies = existingFav ? existingFav.split(',') : []
  },
  computed: {},
  methods: {
    async updateSearch() {
      this.movieIdea = {}
      if (this.search && this.search.length > 2) {
        this.searchedMovies = await this.searchForMovies(this.search)
      }
      return []
    },
    async searchForMovies(query: string): Promise<any[]> {
      let searchedMovies = [] as any[]
      const movies = await axios
        .get(
          ' https://api.themoviedb.org/3/search/movie?api_key=' +
            api_key +
            '&language=fr&query=' +
            query +
            '&page=1&include_adult=false'
        )
        .then((response: any) => {
          searchedMovies = response.data.results
        })
      return searchedMovies
    },
    toggleFavorite(id: string) {
      if (this.favoriteMovies.includes(id.toString())) {
        this.favoriteMovies = this.favoriteMovies.filter(
          (favId) => favId.toString() !== id.toString()
        )
      } else {
        this.favoriteMovies.push(id.toString())
      }
      localStorage.setItem('favoriteMovies', this.favoriteMovies.toString())
    },
    async findMovie() {
      this.search = ''
      const randomId = this.getRandomInt(this.favoriteMovies.length)
      const movie = await axios
        .get(
          ' https://api.themoviedb.org/3/movie/' +
            this.favoriteMovies[randomId] +
            '?api_key=' +
            api_key +
            '&language=fr'
        )
        .then((response: any) => {
          this.movieIdea = response.data
        })
    },
    getRandomInt(max: number) {
      return Math.floor(Math.random() * Math.floor(max))
    }
  },
  watch: {
    search: function() {
      this.updateSearch()
    }
  }
})
</script>

<style lang="scss">
html {
  overflow: hidden;
}
$primary: red;
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
  display: flex;
  justify-content: center;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.actions {
  display: flex;
  justify-content: space-around;
}

.search-box,
.find-button {
  max-width: 80%;
  margin: 2%;
}

.header {
  width: 50%;
}

.gallery,
.idea {
  width: 50%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  height: 100vh;
  overflow: auto;
  scrollbar-color: #eee #ff;
  scrollbar-width: thin;
}

.card {
  width: 200px;
  margin: 1%;
  height: auto;
  max-height: 450px;
  overflow: hidden;
}

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
    }
  }
}

.fav {
  background-color: rgba(250, 100, 50, 0.5);
}

figure {
  background-size: cover;
}
</style>
