import SockJS from "sockjs-client";
import Stomp from "stompjs";

class WebSocketService {
  stompClient = null;

  connect() {
    const socket = new SockJS("http://localhost:8080/ws");
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, () => {
      console.log("WebSocket Connected");
    });
  }

  disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
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
}

const webSocketService = new WebSocketService();
export default webSocketService;