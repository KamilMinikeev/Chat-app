import SockJS from "sockjs-client";
import Stomp from "stompjs";

class WebSocketService {
  stompClient = null;

  connect(callback) {
    this.connectCallback = callback;
    const socket = new SockJS("http://localhost:8080/chatup");
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, () => {
      console.log("WebSocket Connected");
      if (this.connectCallback) {
        this.connectCallback();
      }
    });
  }

  disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
  }

  onConnect(callback) {
    this.onConnectCallback = callback;
  }

  subscribeToNewMessages(callback) {
    if (this.stompClient !== null) {
      this.stompClient.subscribe("/topic/newMessages", (response) => {
        const newMessage = JSON.parse(response.body);
        callback(newMessage);
      });
    }
  }

  sendMessage(message) {
    if (this.stompClient !== null) {
      this.stompClient.send("/app/private-room", {}, JSON.stringify(message));
    }
  }

  subscribeToPrivateChat(senderUsername, callback) {
    if (!this.stompClient) {
      console.warn("WebSocket connection is not established.");
      return;
    }

    const subscription = `/user/${senderUsername}/queue/private-chat`;

    this.stompClient.subscribe(subscription, (response) => {
      const message = JSON.parse(response.body);
      callback(message);
    });
  }

  subscribeToPrivateChat2(senderUsername, recipientUsername, callback) {
    if (!this.stompClient) {
      return;
    }

    const subscription = `/user/${senderUsername}/${recipientUsername}/queue/private-chat`;

    this.stompClient.subscribe(subscription, (response) => {
      const message = JSON.parse(response.body);
      callback(message);
    });
  }

  unsubscribeAll() {
    console.log("this.stompClient:", this.stompClient);
    console.log(
      "this.stompClient.subscriptions:",
      this.stompClient.subscriptions
    );

    if (
      !this.stompClient ||
      typeof this.stompClient.subscriptions !== "object"
    ) {
      return;
    }

    console.log(9999);

    // Отписываемся от всех текущих подписок
    for (const subscriptionId in this.stompClient.subscriptions) {
      const subscription = this.stompClient.subscriptions[subscriptionId];
      this.stompClient.unsubscribe(subscription); // Передаем объект подписки
    }
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;
