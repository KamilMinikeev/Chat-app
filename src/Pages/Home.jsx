import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";

import axios from "axios";

import { useUser } from "../context/UserContext";

import webSocketService from "../services/WebSocketService";

const Home = () => {
  const { user, setUser } = useUser();

  const [activeUser, setActiveUser] = useState({});

  const [activeChat, setActiveChat] = useState(null);

  const [isNewChat, setIsNewChat] = useState(false);

  const [roomId, setRoomId] = useState(null);

  const [messages, setMessages] = useState([]);

  const [chats, setChats] = useState([]);

  useEffect(() => {
    //Получение данных с глобального хранилища
    const userDataFromLocalStorage = JSON.parse(localStorage.getItem("user"));
    const roomIdFromLocalStorage = JSON.parse(localStorage.getItem("roomId"));
    const messagesFromLocalStorage = JSON.parse(
      localStorage.getItem("messages")
    );
    const activeChatFromLocalStorage = JSON.parse(localStorage.getItem("chat"));
    const savedUser = localStorage.getItem("activeUser");
    if (userDataFromLocalStorage) {
      setUser(userDataFromLocalStorage);
    }
    if (roomIdFromLocalStorage) {
      setRoomId(roomIdFromLocalStorage);
    }
    if (messagesFromLocalStorage) {
      setMessages(messagesFromLocalStorage);
    }
    if (messagesFromLocalStorage) {
      setActiveChat(activeChatFromLocalStorage);
    }
    if (savedUser) {
      setActiveUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    // Подключаемся к WebSocket

    webSocketService.connect(() => {
      fetchData();
    });

    // Получение чатов

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/private-rooms/${user.id}`
        );

        if (response.status >= 200 && response.status < 300) {
          setChats(response.data);
          const newChats = response.data;
          setChats(newChats);

          unsubscribeAll();

          webSocketService.subscribeToPrivateChat2(
            user.username,
            activeUser.username,
            (chatInfo) => {
              console.log("Received response3 for user", chatInfo);

              setMessages((prevMessages) => {
                const updatedMessages = [
                  ...prevMessages,
                  {
                    id: generateUniqueId(),
                    sender: {
                      id: activeUser.id,
                      username: activeUser.username,
                    },
                    recipient: {
                      id: user.id,
                      username: user.username,
                    },
                    payload: chatInfo.payload,
                  },
                ];

                localStorage.setItem(
                  "messages",
                  JSON.stringify(updatedMessages)
                );

                return updatedMessages;
              });
            }
          );
        } else {
        }
      } catch (error) {
        console.error("Ошибка запроса:", error);
      }
    };
  }, [user]);

  //Клик на пользователя из поиска
  const handleChatUser = (user) => {
    setActiveUser(user);
    localStorage.setItem("activeUser", JSON.stringify(user));
    const recipientChats = chats.filter(
      (chat) => chat.recipient.id === user.id
    );

    if (recipientChats.length > 0) {
      // берем первый чат (на будущее нюансы - групповой чат или частный - сравниваем)
      const firstRecipientChat = recipientChats[0];
      setActiveChat(firstRecipientChat);
      localStorage.setItem("chat", JSON.stringify(firstRecipientChat));

      // запрос на сообщения по privateRoomId
      fetchMessages(firstRecipientChat.id);

      setIsNewChat(false);

      setRoomId(firstRecipientChat.id);
      localStorage.setItem("roomId", JSON.stringify(firstRecipientChat.id));
    } else {
      setIsNewChat(true);

      setMessages("");
      localStorage.setItem("messages", JSON.stringify(""));
    }

    localStorage.setItem("activeUser", JSON.stringify(user));
  };

  const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  };

  // Клик на чат
  const setNewChat = (newChat) => {
    setActiveChat(newChat);
    localStorage.setItem("chat", JSON.stringify(newChat));
    setActiveUser({
      id: newChat.recipient.id,
      username: newChat.recipient.username,
    });

    localStorage.setItem(
      "activeUser",
      JSON.stringify({
        id: newChat.recipient.id,
        username: newChat.recipient.username,
      })
    );

    setRoomId(newChat.id);
    localStorage.setItem("roomId", JSON.stringify(newChat.id));

    fetchMessages(newChat.id);
  };

  // Получение списка сообщений
  const fetchMessages = (privateRoomId) => {
    axios
      .get(`http://localhost:8080/api/v1/messages/${privateRoomId}`)
      .then((response) => {
        setMessages(response.data);
        localStorage.setItem("messages", JSON.stringify(response.data));
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  };

  // Отправка сообщения
  const submitMessage = (newMessage) => {
    const message = {
      privateRoomId: isNewChat ? null : roomId,
      senderId: user.id,
      recipientId: activeUser.id,
      payload: newMessage,
    };

    if (isNewChat) {
      webSocketService.subscribeToPrivateChat(user.username, (chatInfo) => {
        console.log("Received response1:", chatInfo);
        setChats((prevChats) => {
          const updatedChats = [
            ...prevChats,
            {
              id: chatInfo,
              sender: {
                id: user.id,
                username: user.username,
                bio: null,
              },
              recipient: {
                id: activeUser.id,
                username: activeUser.username,
                bio: null,
              },
              lastMessage: newMessage,
            },
          ];

          localStorage.setItem("chats", JSON.stringify(updatedChats));

          return updatedChats;
        });
        setIsNewChat(false);
        setRoomId(chatInfo);
        localStorage.setItem("roomId", JSON.stringify(chatInfo));
      });

      webSocketService.subscribeToPrivateChat(
        activeUser.username,
        (chatInfo) => {
          console.log("Received response2:", chatInfo);

          setChats((prevChats) => {
            const updatedChats = prevChats.map((chat) => {
              if (chat.recipient.username === activeUser.username) {
                return {
                  ...chat,
                  lastMessage: chatInfo.payload,
                };
              }
              return chat;
            });
            return updatedChats;
          });
        }
      );
    } else {
      const existingChat = chats.find((chat) => chat.id === activeChat.id);

      if (existingChat) {
        const updatedChats = chats.map((chat) => {
          if (chat.id === existingChat.id) {
            return {
              ...chat,
              lastMessage: newMessage,
            };
          }
          return chat;
        });

        console.log(updatedChats);
        setChats(updatedChats);
      }
    }

    webSocketService.sendMessage(message);

    const updatedMessages = [
      ...messages,
      {
        id: generateUniqueId(),
        sender: {
          id: user.id,
          username: user.username,
        },
        recipient: {
          id: activeUser.id,
          username: activeUser.username,
        },
        payload: newMessage,
      },
    ];

    setMessages(updatedMessages);
    localStorage.setItem("messages", JSON.stringify(updatedMessages));
  };

  const generateUniqueId = () => {
    return "_" + Math.random().toString(36).substr(2, 9);
  };

  return (
    <div className="home">
      <Sidebar
        handleChatUser={handleChatUser}
        chats={chats}
        setNewChat={setNewChat}
        user={user}
      />
      <div className="chat-inner">
        {!isEmptyObject(activeUser) ? (
          <Chat
            activeUser={activeUser}
            messages={messages}
            chats={chats}
            submitMessage={submitMessage}
            isNewChat={isNewChat}
            roomId={roomId}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Home;
