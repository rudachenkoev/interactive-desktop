<script setup lang="ts">
type menuItem = {
  routeName: string
  name: string
}
const menuItems:menuItem[] = [
  { routeName: 'interactive-desktop', name: 'Interactive desktop' },
  { routeName: 'socket-interaction', name: 'Socket interaction' }
]
</script>

<template lang="pug">
div.navbar
  router-link(
    v-for="item in menuItems"
    :to="{ name: item.routeName }").navbar-item {{ item.name }}
</template>

<style scoped lang="sass">
.navbar
  padding: 16px 24px
  display: flex
  align-items: center
  background-color: #242424
  &-item
    color: #FFF
    &.router-link-active
      font-weight: 500
      text-decoration: underline
    & + .navbar-item
      margin-left: 24px
</style>
