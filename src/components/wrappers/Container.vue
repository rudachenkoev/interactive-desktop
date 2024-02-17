<script setup lang="ts">
import { ref } from 'vue'

defineProps({
  gridContent: { type: Boolean, default: false }
})

const contentRef = ref()

defineExpose({ contentRef })
</script>

<template lang="pug">
div.wrapper-container
  div.wrapper-container__actions
    slot(name="actions")
  div(ref="contentRef" :class="{ 'grid-layout': gridContent }").wrapper-container__content
    slot(name="content")
</template>

<style scoped lang="sass">
.wrapper-container
  width: 100%
  height: 100%
  background: #FAFAFA
  display: flex
  flex-direction: column
  &__content
    flex: 1
    &.grid-layout
      background: linear-gradient(-90deg, rgba(0, 0, 0, .1) 1px, transparent 1px), linear-gradient(rgba(0, 0, 0, .1) 1px, transparent 1px)
      background-size: 10px 10px, 10px 10px
  &__actions
    border-top: 1px solid #1a1a1a
    padding: 16px 24px
    :deep(button) + button
      margin-left: 24px
</style>
