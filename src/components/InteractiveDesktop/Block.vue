<script setup lang="ts">
import VueDraggableResizable from 'vue-draggable-resizable'

defineProps({
  block: { type: Object, default: null, required: true }
})
defineEmits(['onActivated', 'onDelete', 'onResize', 'onDrag'])
</script>

<template lang="pug">
VueDraggableResizable(
  :w="block.width"
  :minWidth="150"
  :maxWidth="300"
  :h="block.height"
  :minHeight="100"
  :maxHeight="200"
  :x="block.coords.x"
  :y="block.coords.y"
  :z="block.zIndex"
  :grid="[10, 10]"
  parent
  @activated="$emit('onActivated')"
  @resizing="(left, top, width, height) => $emit('onResize', { width, height })"
  @dragging="(left, top) => $emit('onDrag', { x: left, y: top })").content-block
  slot
    p Key: {{ block.id }}
      span(@click="$emit('onDelete')").close &#x2715;
</template>

<style scoped lang="sass">
.content-block
  display: flex
  place-items: center
  flex-direction: column
  background: #FFF
  border: 1px solid #000
  color: #1a1a1a
  .close
    position: absolute
    top: 8px
    right: 12px
    cursor: pointer
    transition: all ease-in-out 0.4s
    &:hover
      opacity: 0.8
      transition: all ease-in-out 0.4s
</style>
