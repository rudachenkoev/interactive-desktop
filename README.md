# Interactive desktop

**Stack:** Vue.js (Composition API), Typescript.

An example of implementing a single-page application with two sections:

1. interface with arbitrary placement of blocks on the desktop;
   > The template consists of 5 different blocks placed on a grid (i.e. movement on both axes is done by certain increments, e.g. 10px).
   > The elements must be movable and removable/returnable, and their size must be resizable on both axes.
   > In addition, the position and height of elements should be resistant to browser reloading and tab closing/opening.
2. interaction with the server via WebSocket protocol.
   > Subscribe to new unconfirmed bitcoin transactions using Blockchain [WebSocket API](https://www.blockchain.com/api/api_websocket).
   > The interface should have a constantly updated list of transactions, the sum of displayed transactions, and three buttons:
   > - "Start" - subscribes to messages about new transactions;
   > - "Stop" - unsubscribes from messages about new transactions;
   > - "Reset" - clears the list of transactions and resets the sum.
