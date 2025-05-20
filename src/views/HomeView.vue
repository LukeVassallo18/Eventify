<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />
    <HeroSection />
        <Features />
    <UpcomingEvents />
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import HeroSection from '@/components/HeroSection.vue'
import Features from '@/components/Features.vue'
import UpcomingEvents from '@/components/UpcomingEvents.vue'
import Footer from '@/components/Footer.vue'
</script>
