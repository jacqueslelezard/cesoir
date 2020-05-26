<template>
  <transition name="fade" mode="out-in">
    <img :key="toggleSpin" class="logo" src="./../static/film-roll.svg" />
  </transition>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    toggleSpin: {
      type: Boolean,
      required: true
    }
  }
})
</script>
<style>
.logo {
  width: 100px;
  height: 100px;
  animation: 1s spin ease;
  margin: 5px;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.01s ease;
  animation-duration: 0.01s;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  80% {
    height: 110px;
    width: 110px;
    margin: 0;
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
