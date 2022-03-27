<template>
  <div class="carousel">
    <div class="carousel-inner">
      <carousel-item
        v-for="(slide, index) in slides"
        :key="'slide-' + index"
        :src="slide"
        :current-slide="currentSlide"
        :index="index"/>
    </div>
  </div>
</template>

<script>
import CarouselItem from '@/views/post-detail/components/carousel-item'
export default {
  components: { CarouselItem },
  name: 'Carousel',
  props: ['slides'],
  data() {
    return {
      currentSlide: 0,
      slideInterval: null
    }
  },
  methods: {
    setCurrentSlide(slide) {
      this.currentSlide = slide
    }
  },
  mounted() {
    this.slideInterval = setInterval(() => {
      const nextSlide = this.currentSlide < this.slides.length - 1 ? this.currentSlide + 1 : 0
      this.setCurrentSlide(nextSlide)
    }, 2000)
  }
}
</script>

<style scoped>
.carousel{
  display: flex;
  justify-content: center;
}
.carousel-inner{
  position: relative;
  width: 450px;
  height: 300px;
  overflow: hidden;
  border-radius: 5px;
}

</style>
