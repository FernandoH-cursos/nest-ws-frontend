import { connectToServer } from './socket-client'
import './style.css'
// import { setupCounter } from './counter.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = /*html*/`
  <div>
    <h2>Websocket - Client</h2>

    <input type="text" id="jwt-token" placeholder="Json Web Token">
    <button type="button">Connect</button>
    <br>

    <span id="server-status">offline</span>

    <ul id="clients-ul"></ul>

    <form id="message-form">
      <input type="text" id="message-input" placeholder="message">
    </form>

    <h3>Messages</h3>
    <ul id="messages-ul"></ul>
  </div>
`

// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
// connectToServer();

const $jwtToken = document.querySelector<HTMLInputElement>('#jwt-token')!;
const $connectButton = document.querySelector<HTMLButtonElement>('button')!;

//* Manda el JWT al servidor para que lo valide y si es correcto, se conecta al servidor de websockets 
$connectButton.addEventListener('click', () => {
  if ($jwtToken.value.trim().length <= 0) return alert('Enter a valid JWT');

  connectToServer($jwtToken.value.trim());
});
