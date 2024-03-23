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
    if (!this.stompClient) {
      return;
    }

    // Отписываемся от всех текущих подписок
    this.stompClient.subscriptions.forEach((subscription) => {
      this.stompClient.unsubscribe(subscription.id);
    });
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;
