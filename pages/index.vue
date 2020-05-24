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
      <div
        class="card card-max"
        @click="toggleFavorite(movieIdea.id)"
        :class="{ fav: favoriteMovies.includes(movieIdea.id.toString()) }"
      >
        <div class="card-image">
          <figure
            class="image is-4by3"
            :style="{
              backgroundImage:
                'url(https://image.tmdb.org/t/p/w600_and_h900_bestv2/' +
                movieIdea.poster_path +
                ')'
            }"
          ></figure>
        </div>
        <div class="card-content">
          <div class="media">
            <div class="media-content">
              <p class="title is-4">{{ movieIdea.title }}</p>
              <p class="subtitle is-6">{{ movieIdea.release_date }}</p>
            </div>
          </div>

          <div class="content">
            {{ movieIdea.overview }}
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
// import axios from '@nuxtjs/axios'
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
    console.log('existingFav', existingFav)
    this.favoriteMovies = existingFav ? existingFav.split(',') : []
  },
  computed: {},
  methods: {
    async updateSearch() {
      this.movieIdea = {}
      if (this.search && this.search.length > 2) {
        console.log('searching...')
        this.searchedMovies = await this.searchForMovies(this.search)
      }
      return []
      console.log('not long enought to start searching...')
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
          console.log('response', searchedMovies)
        })
      // console.log('response', response)
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
      console.log('searching for a movie')
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
  overflow: hidden;
}

.card-max {
  width: 90%;
  height: 90vh;
  margin: 5%;
  overflow: auto;
  scrollbar-color: #eee #fff;
  scrollbar-width: thin;
}

.fav {
  background-color: rgba(250, 50, 50, 0.5);
}

figure {
  background-size: cover;
}
</style>
