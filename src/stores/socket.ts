import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Item } from 'vue3-easy-data-table'

export const useSocketStore = defineStore('socket', () => {
  const ws = ref<WebSocket>()
  const transactions = ref<Item[]>([])
  const isSubscribed = ref(false)
  const totalAmount = ref(0)

  function connect(url: string):Promise<void> {
    return new Promise((resolve, reject) => {
      ws.value = new WebSocket(url)
      ws.value.onopen = () => {
        onOpen()
        resolve()
      }
      ws.value.onerror = (error) => {
        onError(error)
        reject(error)
      }
      ws.value.onmessage = onMessage
      ws.value.onclose = onClose
    })
  }
  function onOpen():void {
    isSubscribed.value = true
  }
  function onMessage(event: MessageEvent): void {
    const data = JSON.parse(event.data)
    const amount = data.x.out.reduce((acc: number, { value }: { value: number }) => acc + value, 0) / 100000000
    totalAmount.value += amount
    transactions.value.unshift({
      from: data.x.inputs[0].prev_out.addr,
      to: data.x.out[0].addr,
      amount: amount.toFixed(8)
    })
  }
  function onError(error: Event):void {
    console.error('WebSocket error:', error)
    alert('Something went wrong')
  }
  function onClose():void {
    isSubscribed.value = false
  }

  return { ws, transactions, totalAmount, isSubscribed, connect }
})
