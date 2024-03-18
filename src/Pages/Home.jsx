import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";

import axios from "axios";

import { useUser } from "../context/UserContext";

import webSocketService from "../services/WebSocketService";

const Home = () => {
  const { user } = useUser();

  const [activeUser, setActiveUser] = useState({});

  const [activeChat, setActiveChat] = useState(null);

  const [isNewChat, setIsNewChat] = useState(false);

  const [roomId, setRoomId] = useState(null);

  const [messages, setMessages] = useState([
    // {
    //   id: "18",
    //   privateRoomId: "13",
    //   payload: "Hiii!",
    //   sender: {
    //     id: "1",
    //     username: "Kamil",
    //     bio: null,
    //   },
    //   recipient: {
    //     id: "3",
    //     username: "Aliya",
    //     bio: null,
    //   },
    // },
  ]);

  const [chats, setChats] = useState([
    // {
    //   id: "22",
    //   recipient: {
    //     id: "3",
    //     username: "Aliya",
    //     bio: null,
    //   },
    //   lastMessage: "Last Message",
    // },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      
      try {
        const user  = JSON.parse(localStorage.getItem("user"));
        console.log(user);
        // TODO refactor retrieving user
        const response = await axios.get(
          `http://localhost:8080/api/v1/private-rooms/${user.id}`
        );

        if (response.status >= 200 && response.status < 300) {
          console.log(user)
          setChats(response.data);
        } else {
        }
      } catch (error) {
        console.error("Ошибка запроса:", error);
      }
    };

    fetchData();
  }, []);

  const handleChatUser = (user) => {
    setActiveUser(user);

    const recipientChats = chats.filter(
      (chat) => chat.recipient.id === user.id
    );

    if (recipientChats.length > 0) {
      // берем первый чат (на будущее нюансы - групповой чат или частный - сравниваем)
      const firstRecipientChat = recipientChats[0];
      setActiveChat(firstRecipientChat.id);

      // запрос на сообщения по privateRoomId
      fetchMessages(firstRecipientChat.id);

      setIsNewChat(false);
    } else {
      setIsNewChat(true);

      setMessages("");
    }

    localStorage.setItem("activeUser", JSON.stringify(user));
  };

  const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  };

  // useEffect(() => {
  //   const savedUser = localStorage.getItem("activeUser");
  //   if (savedUser) {
  //     setActiveUser(JSON.parse(savedUser));
  //   }
  //   // localStorage.clear();
  // }, []);

  const setNewChat = (newChat) => {
    setActiveChat(newChat);
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

    fetchMessages(newChat.id);
  };

  const fetchMessages = (privateRoomId) => {
    axios
      .get(`http://localhost:8080/api/v1/messages/${privateRoomId}`)
      .then((response) => {
        console.log("response = ", response)
        setMessages(response.data);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  };

  useEffect(() => {
    webSocketService.connect();

    // webSocketService.subscribeToNewMessages((newMessage) => {
    //   console.log("New message received:", newMessage);
    // });

    // return () => {
    //   webSocketService.disconnect();
    // };
    
    //TODO : refactor disconnect
  }, []);


  const submitMessage = (newMessage) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const message = {
      privateRoomId: isNewChat ? null : roomId,
      senderId: user.id,
      recipientId: activeUser.id,
      payload: newMessage,
    };

    if (isNewChat) {
      webSocketService.subscribeToPrivateChat(user.username, (chatInfo) => {
        console.log("Received response1:", chatInfo);
        setChats((prevChats) => [
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
        ]);
        setRoomId(chatInfo); ///////////////////////////
        setIsNewChat(false);
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

      setChats((prevChats) => [
        ...prevChats,
        {
          id: "chatInfo.body.privateRoomId",
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
      ]);
    } 
    else {
      const existingChat = chats.find((chat) => chat.id === activeChat);
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
        setChats(updatedChats);
      }
    }

    webSocketService.sendMessage(message);

    setMessages((prevMessages) => {
      if (prevMessages) {
      }

      console.log(prevMessages)
      return [
        ...prevMessages,
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
    });
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
      />
      <div className="chat-inner">
        {!isEmptyObject(activeUser) ? (
          <Chat
            activeUser={activeUser}
            messages={messages}
            submitMessage={submitMessage}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Home;
