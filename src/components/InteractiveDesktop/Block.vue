<script setup lang="ts">
/*
  For the drag and drop and resize functionality, I decided to use the pre-built vue-draggable-resizable (url: https://www.npmjs.com/package/vue-draggable-resizable) library.
  It has a large community, provides all the needs of the specification and has a small size.
*/
import VueDraggableResizable from 'vue-draggable-resizable'
import 'vue-draggable-resizable/style.css'
type Block = {
  id: string
  width: number
  height: number
  coords: {
    x: number
    y: number
  }
  zIndex: number
}
//
defineProps<{
  block: Block
}>()
defineEmits<{
  onActivated: (index: number) => void
  onDelete: (block: Block, index: number) => void
  onResize: (dimensions: { width: number, height: number }, index: number) => void
  onDrag: (coords: { x: number, y: number }, index: number) => void
}>()
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
    transition: opacity ease-in-out 0.4s
    &:hover
      opacity: 0.8
</style>
