<script setup lang="ts">
/*
  I chose the vue3-easy-data-table library (link: https://www.npmjs.com/package/vue3-easy-data-table) to display the transaction data.
  It closes the needs with pagination and displaying the necessary number of records.
  And state management library Pinia to save transaction history when switching between pages (url: https://www.npmjs.com/package/pinia).
*/
import { defineAsyncComponent } from 'vue'
import Vue3EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'
import type { Header } from 'vue3-easy-data-table'
import { useSocketStore } from '@/stores/socket'
import { storeToRefs } from 'pinia'
//
const ContainerWrapper = defineAsyncComponent(() => import('@components/Wrappers/Container.vue'))

const headers:Header[] = [
  { text: 'From', value: 'from' },
  { text: 'To', value: 'to' },
  { text: 'Sum', value: 'amount' }
]
const socketStore = useSocketStore()
const { ws, transactions, totalAmount, isSubscribed } = storeToRefs(socketStore)
const { connect } = socketStore

function startUnconfirmedSubscription():void {
  try {
    connect('wss://ws.blockchain.info/inv').then(() => {
      if (ws.value?.readyState !== 1) return
      ws.value.send(JSON.stringify({ op: 'unconfirmed_sub' }))
    })
  } catch (error) {
    console.error(error)
  }
}
function stopUnconfirmedSubscription():void {
 try {
   if (ws.value?.readyState !== 1) return
   ws.value.send(JSON.stringify({ op: 'unconfirmed_unsub' }))
   ws.value.close()
 } catch (error) {
   console.error(error)
 }
}
function resetSubscription():void {
  totalAmount.value = 0
  transactions.value = []
}
</script>

<template lang="pug">
ContainerWrapper
  template(#content)
    h3 Total amount: {{ totalAmount }}
    Vue3EasyDataTable(
      :headers="headers"
      :items="transactions"
      header-text-direction="center"
      body-text-direction="center"
      border-cell
      buttons-pagination)
  template(#actions)
    button(v-if="isSubscribed" :disabled="!isSubscribed" @click="stopUnconfirmedSubscription") Stop subscription
    button(v-else @click="startUnconfirmedSubscription") Start subscription
    button(@click="resetSubscription") Reset
</template>
