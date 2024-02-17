<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'
import Vue3EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'
import type { Header, Item } from 'vue3-easy-data-table'

const ContainerWrapper = defineAsyncComponent(() => import('@components/wrappers/Container.vue'))

const headers: Header[] = [
  { text: 'From', value: 'from' },
  { text: 'To', value: 'to' },
  { text: 'Sum', value: 'amount' }
]
const isSubscribed = ref(false)
const totalAmount = ref(0)
const transactions = ref<Item[]>([])

let ws:WebSocket
function connect(url: string) {
  return new Promise((resolve, reject) => {
    ws = new WebSocket(url)
    ws.onopen = () => {
      onOpen()
      resolve()
    }
    ws.onerror = () => {
      onError()
      reject()
    }
    ws.onmessage = onMessage
    ws.onclose = onClose
  })
}
function onOpen():void {
  isSubscribed.value = true
}
function onMessage(event:MessageEvent):void {
  const data = JSON.parse(event.data)
  const amount = data.x.out.reduce((acc, output) => acc + output.value, 0) / 100000000
  totalAmount.value += amount
  transactions.value.unshift({
    from: data.x.inputs[0].prev_out.addr,
    to: data.x.out[0].addr,
    amount: amount.toFixed(8)
  })
}
function onError():void {
  alert('Something went wrong')
}
function onClose():void {
  isSubscribed.value = false
}

function startUnconfirmedSubscription():void {
  connect('wss://ws.blockchain.info/inv')
    .then(() => ws.send(JSON.stringify({ op: 'unconfirmed_sub' })))
}
function stopUnconfirmedSubscription():void {
  ws.send(JSON.stringify({ op: 'unconfirmed_unsub' }))
  ws.close()
}
function resetSubscription() {
  totalAmount.value = 0
  transactions.value = []
}
</script>

<template lang="pug">
ContainerWrapper
  template(#content)
    Vue3EasyDataTable(
      :headers="headers"
      :items="transactions"
      header-text-direction="center"
      body-text-direction="center"
      border-cell
      buttons-pagination)
  template(#actions)
    button(:disabled="isSubscribed" @click="startUnconfirmedSubscription") Start subscription
    button(:disabled="!isSubscribed" @click="stopUnconfirmedSubscription") Stop subscription
    button(@click="resetSubscription") Reset
</template>
