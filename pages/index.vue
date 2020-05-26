<template>
  <div class="container">
    <div class="header">
      <h1 class="title">
        <logo :toggle-spin="spin" />
        <span>cesoir</span>
      </h1>
      <h2 class="subtitle">
        Jamais à court d'idée
      </h2>
      <div class="actions">
        <button
          v-if="favoriteMovies.length"
          class="button is-primary is-rounded find-button"
          :class="{ 'is-outlined': showFavorites }"
          @click="selectRandomMovie()"
        >
          Une idée, vite !
        </button>
        <button
          v-if="favoriteMovies.length"
          class="button is-primary is-rounded find-button"
          :class="{
            'is-outlined': !showFavorites && showFavorites !== undefined
          }"
          @click="listFavoriteMovies()"
        >
          Tooous mes films
        </button>
        <input
          v-model="search"
          class="input is-rounded search-box"
          type="text"
          placeholder="J'ajoute un film à ma liste à voir"
        />
      </div>
    </div>
    <idea
      v-if="movieIdea.id"
      :movie-idea="movieIdea"
      :favorite-movies="favoriteMovies"
      @toggle-favorite="toggleFavorite($event)"
    >
    </idea>
    <gallery
      v-if="search.length && !showFavorites"
      :displayed-movies="searchedMovies"
      :favorite-movies="favoriteMovies"
      @toggle-favorite="toggleFavorite($event)"
    >
    </gallery>
    <gallery
      v-if="favoriteMoviesList.length && showFavorites"
      :displayed-movies="favoriteMoviesList"
      :favorite-movies="favoriteMovies"
      @toggle-favorite="toggleFavorite($event)"
    >
    </gallery>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import Logo from './../components/Logo.vue'
import Gallery from './../components/Gallery.vue'
import Idea from './../components/Idea.vue'

const api_key = process.env.TMDB_API_KEY
const tmdb_base_url = 'https://api.themoviedb.org/3/'

export default Vue.extend({
  components: {
    Logo,
    Gallery,
    Idea
  },
  data: () => {
    return {
      search: '' as string,
      movieIdea: {} as any,
      searchedMovies: [] as string[],
      favoriteMovies: [] as string[],
      favoriteMoviesList: [] as any[],
      showFavorites: undefined as boolean | undefined,
      spin: false
    }
  },
  computed: {},
  watch: {
    search() {
      this.updateSearch()
    }
  },
  mounted() {
    const existingFav = localStorage.getItem('favoriteMovies')
    this.favoriteMovies = existingFav ? existingFav.split(',') : []
  },
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
      this.showFavorites = false
      const movies = await axios
        .get(
          tmdb_base_url +
            'search/movie?api_key=' +
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
    async selectRandomMovie() {
      this.showFavorites = false
      this.spin = !this.spin
      this.search = ''
      const randomId = this.getRandomInt(this.favoriteMovies.length)
      this.movieIdea = await this.findMovie(this.favoriteMovies[randomId])
    },
    async findMovie(movieId: string) {
      const movie = await axios
        .get(
          tmdb_base_url +
            'movie/' +
            movieId +
            '?api_key=' +
            api_key +
            '&language=fr'
        )
        .then((response: any) => {
          return response.data
        })
      return movie
    },
    async listFavoriteMovies() {
      this.showFavorites = true
      this.search = ''
      this.movieIdea = {}
      this.favoriteMoviesList = await Promise.all(
        this.favoriteMovies.map(
          async (movieId): Promise<number> => {
            return await this.findMovie(movieId)
          }
        )
      )
    },
    getRandomInt(max: number) {
      return Math.floor(Math.random() * Math.floor(max))
    }
  }
})
</script>

<style lang="scss">
html {
  overflow: hidden;
}

.container {
  margin: 0 auto;
  min-height: 100vh;
  max-width: 95%;
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
  margin: 1%;
}

.header {
  width: 50%;
  transition: 0.3s ease;
}

.gallery,
.idea {
  width: 50%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  height: 100vh;
  overflow: auto;
  scrollbar-color: #eee #fff;
  scrollbar-width: thin;
  transition: 0.3s ease;

  .title {
    display: block;
  }

  .favButtonMin {
    height: 20px;
    width: 20px;
  }
  .disabledFavButton {
    filter: grayscale(100%);
  }
}
.fav {
  background-color: rgba(250, 100, 50, 0.3);
}

figure {
  background-size: cover;
}
</style>
