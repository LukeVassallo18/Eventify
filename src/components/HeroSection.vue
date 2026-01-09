<template>
  <div class="text-center py-20 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
    <h1 class="text-4xl md:text-5xl font-bold mb-4">Organize & Discover Events Effortlessly</h1>
    <p class="text-lg mb-6">Join thousands in managing or attending your favorite events</p>

    <button
      @click="scrollToEvents"
      class="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-semibold rounded-lg shadow-lg group transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-white"
    >
      <span
        class="absolute inset-0 w-full h-full bg-white group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-500 transition-all duration-300 ease-in-out"
      ></span>
      <span
        class="relative text-indigo-600 group-hover:text-white transition duration-300 ease-in-out"
      >
        Explore Events
      </span>
    </button>
  </div>
</template>

<script setup>
const scrollToEvents = () => {
  const target = document.getElementById('upcoming-events')
  if (!target) return

  const targetPosition = target.getBoundingClientRect().top + window.pageYOffset
  const startPosition = window.pageYOffset
  const distance = targetPosition - startPosition
  const duration = 1000 // milliseconds (1 second)
  let startTime = null

  const easeInOutQuad = (t) =>
    t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t

  const animateScroll = (currentTime) => {
    if (!startTime) startTime = currentTime
    const timeElapsed = currentTime - startTime
    const run = easeInOutQuad(timeElapsed / duration) * distance + startPosition
    window.scrollTo(0, run)
    if (timeElapsed < duration) requestAnimationFrame(animateScroll)
  }

  requestAnimationFrame(animateScroll)
}
</script>
