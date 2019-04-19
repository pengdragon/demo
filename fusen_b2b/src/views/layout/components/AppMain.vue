<template>
  <section class="app-main">
    <transition name="fade" mode="out-in">
      <keep-alive :max="20">
         <router-view :key="key"></router-view>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.fullPath
    }
  }
}
</script>
