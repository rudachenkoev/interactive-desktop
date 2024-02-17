<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
//
const NavbarMenu = defineAsyncComponent(() => import('@/components/Navbar.vue'))
</script>

<template lang="pug">
NavbarMenu
div(style="flex: 1")
  router-view
</template>
