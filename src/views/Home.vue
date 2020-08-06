<template>
  <div class="home">
    <agile ref="main" :fade="true">...</agile>
    <agile
      ref="thumbnails"
      :as-nav-for="[$refs.main]"
      :slides-to-show="4"
      autoplay
      >...</agile
    >
  </div>
</template>

<script>
// @ is an alias to /src
import { VueAgile } from 'vue-agile'

export default {
  name: 'Home',
  components: {
    agile: VueAgile,
  },
}
</script>
