<template>
    <img class="carousel-item" :src="src" v-show="currentSlide === index"/>
</template>

<script>
export default {
  name: 'CarouselItem',
  props: ['src', 'currentSlide', 'index']
}
</script>

<style scoped>
.carousel-item{
  width: 100%;
  height: 100%;
  display: block;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

</style>
