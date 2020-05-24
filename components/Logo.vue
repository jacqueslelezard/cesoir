<template>
  <img class="logo" src="./../static/film-roll.svg" />
</template>
<style>
.logo {
  animation: 2s appear ease;
  width: 100px;
}

@keyframes appear {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
