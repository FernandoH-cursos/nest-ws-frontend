import { Manager, Socket } from "socket.io-client";

//* Mejor tener un solo socket en toda la aplicación para evitar duplicar listeners y mensajes cada vez que se conecta y desconecta
//* del servidor de websockets.
let socket: Socket; 

export const connectToServer = (token: string) => {
  //* 'Manager' es la clase que se encarga de manejar la conexión con el servidor de Socket.io
  //* La propiedad 'extraHeaders' permite añadir cabeceras personalizadas a la petición de conexión con el servidor de Socket.io
  //* En este caso, se añade la cabecera 'authentication' con el valor del token JWT que se recibe como argumento de la función
  const manager = new Manager("http://localhost:3000/socket.io/socket.io.js", {
    extraHeaders: {
      hola: "mundo",
      authentication: token,
    },
  });

  //* Se eliminan todos los listeners que estén asociados al socket para evitar que se dupliquen los listeners cada vez que se conecta
  //* y desconecta del servidor de websockets. De esta forma, se evita que se dupliquen los mensajes que se reciben del servidor d
  //* websockets cada vez que se conecta y desconecta del servidor de websockets.
  socket?.removeAllListeners();

  //* 'socket' es el objeto que se encarga de manejar la conexión con el servidor de Socket.io y de enviar y recibir mensajes
  socket = manager.socket("/");
  // console.log(socket);

  addListerners();
};

//* Esta función se encarga de añadir los listeners a los eventos que se emiten desde el servidor de websockets hacia el cliente
const addListerners = () => {
  const $serverStatus =
    document.querySelector<HTMLSpanElement>("#server-status")!;
  const $clientsUl = document.querySelector<HTMLUListElement>("#clients-ul")!;

  const $messageForm =
    document.querySelector<HTMLFormElement>("#message-form")!;
  const $messageInput =
    document.querySelector<HTMLInputElement>("#message-input")!;

  const $messagesUl = document.querySelector<HTMLUListElement>("#messages-ul")!;

  //* El evento 'connect' se escucha cada vez que el cliente se conecta al servidor de websockets
  socket.on("connect", () => {
    $serverStatus.textContent = "online";
  });

  //* El evento 'disconnect' se escucha cada vez que el cliente se desconecta del servidor de websockets
  socket.on("disconnect", () => {
    $serverStatus.textContent = "offline";
  });

  //* El evento 'clients-updated' se escucha cada vez que el servidor de websockets emite un evento 'clients-updated' que contiene
  //* la lista de clientes conectados al servidor de websockets
  socket.on("clients-updated", (clients: string[]) => {
    let clientsHTML = "";

    clients.forEach((clientId) => {
      clientsHTML += /*html*/ `<li>${clientId}</li>`;
    });

    $clientsUl.innerHTML = clientsHTML;
  });

  $messageForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const message = $messageInput.value;
    if (message.trim().length <= 0) return;

    //* El evento 'message' se emite al servidor de websockets con el mensaje que el cliente desea enviar
    socket.emit("message-from-client", {
      id: "YO!!",
      message,
    });

    $messageInput.value = "";
  });

  socket.on(
    "message-from-server",
    (payload: { fullName: string; message: string }) => {
      const $li = document.createElement("li");
      $li.innerHTML = /*html*/`
        <strong>${payload.fullName}</strong>
        <span>${payload.message}</span>
      `;
      $messagesUl.appendChild($li);
    }
  );
};
