import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";

import { useUser } from "../context/UserContext";

import webSocketService from "../services/WebSocketService";

const Home = () => {
  const { user } = useUser();

  const [activeUser, setActiveUser] = useState({});

  const [activeChat, setActiveChat] = useState(null);

  const [isNewChat, setIsNewChat] = useState(false);

  const [messages, setMessages] = useState([
    {
      senderId: "3",
      recipientId: "1",
      message: "Hi ауа цву цув цув ",
    },
    {
      senderId: "1",
      recipientId: "3",
      message: "Hello wd",
    },
  ]);

  const [chats, setChats] = useState([
    {
      privateRoomId: "22",
      sender: {
        id: "1",
        username: "Kamil",
        bio: null,
      },
      recipient: {
        id: "3",
        username: "Aliya",
        bio: null,
      },
      lastMessage: "Last Message",
    },
  ]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get("");

  //       if (response.status >= 200 && response.status < 300) {
  //         setChats(response.data);
  //       } else {
  //       }
  //     } catch (error) {
  //       console.error("Ошибка запроса:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  const handleChatUser = (user) => {
    setActiveUser(user);

    const senderChats = chats.filter((chat) => chat.sender.id === user.id);

    if (senderChats.length > 0) {
      // берем первый чат (на будущее нюансы - групповой чат или частный - сравниваем)
      const firstSenderChat = senderChats[0];
      setActiveChat(firstSenderChat.privateRoomId);

      // запрос на сообщения по privateRoomId
      fetchMessages(firstSenderChat.privateRoomId);

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

  const addToChats = (prevMessage) => {
    //Нужно отправть этот чат на сервер еще

    setActiveUser((prevActiveUser) => {
      setChats((prevChats) => {
        const existingChatIndex = prevChats.findIndex(
          (chat) => chat.username === prevActiveUser.username
        );

        if (existingChatIndex === -1) {
          return [
            ...prevChats,
            {
              username: prevActiveUser.username,
              lastMessage: prevMessage,
              url: prevActiveUser.url,
            },
          ];
        } else {
          return prevChats.map((chat, index) =>
            index === existingChatIndex
              ? { ...chat, lastMessage: prevMessage }
              : chat
          );
        }
      });

      return prevActiveUser;
    });

    // setChats((prevChats) => {
    //   const existingChatIndex = prevChats.findIndex(
    //     (chat) => chat.username === activeUser.username
    //   );

    //   if (existingChatIndex === -1) {
    //     return [
    //       ...prevChats,
    //       {
    //         username: activeUser.username,
    //         lastMessage: prevMessage,
    //         url: activeUser.url,
    //       },
    //     ];
    //   } else {
    //     return prevChats.map((chat, index) =>
    //       index === existingChatIndex
    //         ? { ...chat, lastMessage: prevMessage }
    //         : chat
    //     );
    //   }
    // });
  };

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

    fetchMessages(newChat.privateRoomId);
  };

  const fetchMessages = (privateRoomId) => {
    // axios
    //   .get(`/api/messages/${privateRoomId}`)
    //   .then((response) => {
    //     setMessages(response.data.messages);
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching messages:", error);
    //   });
  };

  // useEffect(() => {
  //   webSocketService.connect();

  //   webSocketService.subscribeToNewMessages((newMessage) => {
  //     console.log("New message received:", newMessage);
  //   });

  //   return () => {
  //     webSocketService.disconnect();
  //   };
  // }, []);

  const submitMessage = (newMessage) => {
    console.log(activeUser);

    const message = {
      privateRoomId: isNewChat ? null : activeChat,
      senderId: user.id,
      recipientId: activeUser.id,
      payload: newMessage,
    };

    if (isNewChat) {
      // webSocketService.subscribeToPrivateChat(user.username, (chatInfo) => {
      //   console.log("Received response1:", chatInfo);
      //   setChats((prevChats) => [
      //     ...prevChats,
      //     {
      //       privateRoomId: chatInfo.body.privateRoomId,
      //       sender: {
      //         id: user.id,
      //         username: user.username,
      //         bio: null,
      //       },
      //       recipient: {
      //         id: activeUser.id,
      //         username: activeUser.username,
      //         bio: null,
      //       },
      //       lastMessage: newMessage,
      //     },
      //   ]);
      //   setIsNewChat(false);
      // });

      // webSocketService.subscribeToPrivateChat(
      //   activeUser.username,
      //   (chatInfo) => {
      //     console.log("Received response2:", chatInfo);

      //     setChats((prevChats) => {
      //       const updatedChats = prevChats.map((chat) => {
      //         if (chat.recipient.username === activeUser.username) {
      //           return {
      //             ...chat,
      //             lastMessage: chatInfo.payload,
      //           };
      //         }
      //         return chat;
      //       });
      //       return updatedChats;
      //     });
      //   }
      // );

      setChats((prevChats) => [
        ...prevChats,
        {
          privateRoomId: "chatInfo.body.privateRoomId",
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
    } else {
      const existingChat = chats.find(
        (chat) => chat.privateRoomId === activeChat
      );
      if (existingChat) {
        const updatedChats = chats.map((chat) => {
          if (chat.privateRoomId === existingChat.privateRoomId) {
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

    setMessages((prevMessages) => [
      ...prevMessages,
      { senderId: user.id, recipientId: activeUser.id, message: newMessage },
    ]);

    // addToChats(newMessage);
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
            addToChats={addToChats}
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
