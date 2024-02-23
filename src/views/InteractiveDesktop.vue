<script setup lang="ts">
import ContainerWrapper from '@components/Wrappers/Container.vue'
import InteractiveDesktopBlock from '@components/InteractiveDesktop/Block.vue'
import { reactive, ref } from 'vue'
//
const defaultWidth = 300
const defaultHeight = 100

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
const blocks = ref<Block[]>([])
function saveBlocks():void {
  /*
    I'm using localStorage to store changes in a block.
    But in the working version it would be nice to store these values by API with interval in some time interval or to update blocks element by element.
  */
  localStorage.setItem('blocks', JSON.stringify(blocks.value))
}

function loadData():void {
  const savedBlocks = localStorage.getItem('blocks')
  if (savedBlocks) blocks.value = JSON.parse(savedBlocks)
  else fillWithStandardValues()
}
loadData()

function setDefaultBlock():Block {
  return {
    id: generateRandomKey(),
    width: defaultWidth,
    height: defaultHeight,
    coords: { x: 0, y: 0 },
    zIndex: 1
  }
}
function fillWithStandardValues():void {
  // Add 5 default blocks
  for (let i = 0; i < 5; i++) {
    blocks.value.push(setDefaultBlock())
  }
  saveBlocks()
}
function generateRandomKey():string {
  /* Most likely a working version of the product would use a unique value as an identifier,
   but for now I'm generating a random key for this one */
  return Math.random().toString(36).substring(2, 15)
}

function onActivated(index:number):void {
  // Move the selected item to the top layer
  blocks.value[index].zIndex = blocks.value.reduce((max, item) => Math.max(max, item.zIndex), 0) + 1
}

const deletedBlocks = reactive<Block[]>([])
function onDelete(block:Block, index:number):void {
  // Deletion of an existing block with confirmation
  if (confirm('Are you sure you want to remove the block?')) {
    // Remove the block from the desktop
    blocks.value.splice(index, 1)
    // Save the deleted block to temporary deleted blocks
    deletedBlocks.unshift(block)
    saveBlocks()
  }
}
function onResize(dimensions:{ width:number, height:number}, index:number):void {
  Object.assign(blocks.value[index], dimensions)
  saveBlocks()
}
function onDrag(coords:{ x:number, y:number }, index:number):void {
  Object.assign(blocks.value[index].coords, coords)
  saveBlocks()
}

const containerWrapper = ref()
function revertLastDeletedBlock():void {
  if (!deletedBlocks.length || !containerWrapper.value) return
  // Get the container size
  const contentRefRect = containerWrapper.value.$contentRef.getBoundingClientRect()
  const { width:containerRectWidth, height:containerRectHeight } = contentRefRect
  // Set the block to default dimensions and centered positioning
  const centerX = (containerRectWidth / 2) - (defaultWidth / 2)
  const centerY = (containerRectHeight / 2) - (defaultHeight / 2)
  const block: Block = {
    ...deletedBlocks[0],
    width: defaultWidth,
    height: defaultHeight,
    coords: {
      x: Math.max(0, centerX),
      y: Math.max(0, centerY)
    }
  }
  // Retrieve a deleted unit
  blocks.value.push(block)
  // Delete a temporarily saved deleted block
  deletedBlocks.splice(0, 1)
  saveBlocks()
}

function addBlock():void {
  if (blocks.value.length >= 10) return
  blocks.value.push(setDefaultBlock())
  saveBlocks()
}
</script>

<template lang="pug">
ContainerWrapper(ref="containerWrapper" grid-content)
  template(#content)
    InteractiveDesktopBlock(
      :key="`interactive-desktop-block-${block.id}`"
      v-for="(block, index) in blocks"
      :block="block"
      @onActivated="onActivated(index)"
      @onDelete="onDelete(block, index)"
      @onResize="dimensions => onResize(dimensions, index)"
      @onDrag="coords => onDrag(coords, index)")
  template(#actions)
    button(:disabled="!deletedBlocks.length" @click="revertLastDeletedBlock") Revert deleted block
    button(:disabled="blocks.length >= 10" @click="addBlock") Add new block
</template>
