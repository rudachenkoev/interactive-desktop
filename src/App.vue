<script setup lang="ts">
import NavbarMenu from '@/components/Navbar.vue'
</script>

<template lang="pug">
NavbarMenu
div(style="flex: 1")
  router-view
</template>
