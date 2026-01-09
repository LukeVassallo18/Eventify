<template>
  <transition :name="$route.meta.transitionName || 'slide-left'" mode="out-in">
    <RouterView />
  </transition>
</template>

<script setup>
</script>
