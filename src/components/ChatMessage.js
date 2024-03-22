import React, { useState, useEffect, useRef } from "react";

import SendIcon from "@mui/icons-material/Send";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";

const ChatMessage = ({
  onMessageChange,
  submitMessage,
  activeUser,
  isNewChat,
  chats,
  messages,
  roomId,
}) => {
  const inputRef = useRef();

  const [isPlaceholderVisible, setPlaceholderVisible] = useState(true);

  const submit = () => {
    const textContent = inputRef.current.innerText;

    if (textContent !== "") {
      submitMessage(textContent);
      inputRef.current.innerText = "";
      setPlaceholderVisible(true);
      inputRef.current.focus();
    }
  };

  const saveInputValue = () => {
    const textContent = inputRef.current.textContent;
    setPlaceholderVisible(
      textContent === "" || textContent === "Type a message"
    );
    // setMessage(textContent);
    //onChange(text);
  };

  const onKeyDown = (event) => {
    const ENTER_KEY_CODE = 13;

    if (event.keyCode === ENTER_KEY_CODE && event.shiftKey === false) {
      event.stopPropagation();
      event.preventDefault();

      submit();
    }
  };

  const handleKeyDown = (event) => {
    //Проверяем, является ли нажатая клавиша буквой или цифрой
    if (
      (/^\p{L}|\d$/u.test(event.key) ||
        (event.key === "Shift" && !event.getModifierState("CapsLock")) ||
        (event.key === "CapsLock" && !event.getModifierState("Shift")) ||
        (event.key.length === 1 && event.getModifierState("CapsLock"))) &&
      document.activeElement.tagName !== "INPUT"
    ) {
      inputRef.current.focus();
    }
  };

  const handleFocus = () => {
    const input = inputRef.current;

    if (input) {
      const range = document.createRange();
      const selection = window.getSelection();

      range.selectNodeContents(input);
      range.collapse(false); // устанавливаем конец выделения

      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();

    const text = event.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  useEffect(() => {
    const currentInputRef = inputRef.current;

    const handleEvents = () => {
      currentInputRef.addEventListener("keydown", onKeyDown);
      currentInputRef.addEventListener("paste", handlePaste);
      currentInputRef.addEventListener("input", saveInputValue);
      currentInputRef.addEventListener("focus", handleFocus);
      document.addEventListener("keydown", handleKeyDown);
    };

    const removeEvents = () => {
      currentInputRef.removeEventListener("input", saveInputValue);
      currentInputRef.removeEventListener("keydown", onKeyDown);
      currentInputRef.removeEventListener("paste", handlePaste);
      currentInputRef.removeEventListener("focus", handleFocus);
      document.removeEventListener("keydown", handleKeyDown);
    };

    handleEvents();

    return () => {
      removeEvents();
    };
  }, [inputRef, activeUser, isNewChat, chats, messages, roomId]);

  return (
    <div className="chat-message">
      <div className="chat-message__container">
        <div className="chat-message__inner">
          <button className="emoji">
            <SentimentSatisfiedAltIcon />
          </button>
          {isPlaceholderVisible && (
            <div
              className="chat-placeholder"
              onClick={() => inputRef.current.focus()}
            >
              Type a message
            </div>
          )}
          <div
            className="chat-input"
            ref={inputRef}
            placeholder="Type a message"
            contentEditable
          ></div>
        </div>
        <button
          className="chat-message__submit"
          onClick={() => {
            submit();
          }}
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

export default ChatMessage;
