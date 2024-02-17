<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import Vue3EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'
import type { Header } from 'vue3-easy-data-table'
import { useSocketStore } from '@/stores/socket'
import { storeToRefs } from 'pinia'
//
const ContainerWrapper = defineAsyncComponent(() => import('@components/wrappers/Container.vue'))

const headers: Header[] = [
  { text: 'From', value: 'from' },
  { text: 'To', value: 'to' },
  { text: 'Sum', value: 'amount' }
]
const socketStore = useSocketStore()
const { ws, transactions, totalAmount, isSubscribed } = storeToRefs(socketStore)
const { connect } = socketStore

function startUnconfirmedSubscription():void {
  connect('wss://ws.blockchain.info/inv')
    .then(() => ws.value.send(JSON.stringify({ op: 'unconfirmed_sub' })))
}
function stopUnconfirmedSubscription():void {
  ws.value.send(JSON.stringify({ op: 'unconfirmed_unsub' }))
  ws.value.close()
}
function resetSubscription():void {
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
